import sys
import json
from pathlib import Path

import pandas as pd
import joblib


def load_artifacts():
    # This file lives at server/src/pyservice/predict.py
    # Repo root is three levels up from here
    repo_root = Path(__file__).resolve().parents[3]
    artifacts_dir = repo_root / 'artifacts'
    data_dir = artifacts_dir / 'data'
    model_dir = artifacts_dir / 'model'

    # Data files
    balanced_csv = data_dir / 'Balanced_SPID_Dataset.csv'
    composition_csv = data_dir / 'Remedy_Composition_FINAL_Merged.csv'
    dosage_file = data_dir / 'Complete_Remedy_Dosage_Dataset.xls'

    # Load datasets
    training_df = pd.read_csv(balanced_csv)
    # Symptom columns are all headers except the metadata/label columns
    symptom_columns = training_df.drop(
        columns=['SPID', 'Remedy', 'UrgencyScore', 'UrgencyCategory', 'UrgencyCategoryEncoded', 'Condition'],
        errors='ignore'
    ).columns.tolist()

    composition_df = pd.read_csv(composition_csv)
    if 'Remedy' in composition_df.columns:
        composition_df['Remedy'] = composition_df['Remedy'].astype(str).str.strip().str.upper()

    # Load models
    clfu = joblib.load(str(model_dir / 'balanced_urgency_classifier.pkl'))
    reg = joblib.load(str(model_dir / 'urgency_gb_regressor.pkl'))
    clfr = joblib.load(str(model_dir / 'balanced_remedy_classifier.pkl'))

    # Dosage sheet can be xls/xlsx/csv; try excel first then csv
    dosage_df = None
    try:
        dosage_df = pd.read_excel(dosage_file)
    except Exception:
        try:
            dosage_df = pd.read_csv(dosage_file)
        except Exception:
            dosage_df = None
    if dosage_df is not None:
        # Normalize columns (strip spaces)
        dosage_df.columns = [str(c).strip() for c in dosage_df.columns]

    return {
        'symptom_columns': symptom_columns,
        'composition_df': composition_df,
        'dosage_df': dosage_df,
        'models': {'clf_u': clfu, 'reg': reg, 'clf_r': clfr}
    }


def age_category(age: int) -> str:
    if age <= 12:
        return 'Child'
    if age <= 18:
        return 'Adolescent'
    if age <= 60:
        return 'Adult'
    return 'Senior'


def main():
    try:
        raw = sys.stdin.read()
        payload = json.loads(raw or '{}')
        symptoms = payload.get('symptoms', {}) or {}
        age = int(payload.get('age', 0) or 0)
        gender = str(payload.get('gender', '') or '').upper()

        artifacts = load_artifacts()
        symptom_columns = artifacts['symptom_columns']
        composition_df = artifacts['composition_df']
        dosage_df = artifacts['dosage_df']
        models = artifacts['models']

        # Build input row with all required columns, defaulting to 0
        row = {col: int(symptoms.get(col, 0) or 0) for col in symptom_columns}
        input_df = pd.DataFrame([row])[symptom_columns]

        # Determine if we should fallback (<=1 non-zero symptoms)
        non_zero_cols = [c for c, v in row.items() if v and v > 0]
        fallback_used = False

        if len(non_zero_cols) <= 1:
            # Minimal input; still run models for completeness but mark fallback
            fallback_used = True

        # Predict
        cat_pred = models['clf_u'].predict(input_df)[0]
        score_pred = float(models['reg'].predict(input_df)[0])
        remedy_pred = str(models['clf_r'].predict(input_df)[0])

        category_map = {1: 'Low', 2: 'Moderate', 3: 'High'}
        urgency_category = category_map.get(int(cat_pred), str(cat_pred))

        # Composition lookup
        remedy_key = remedy_pred.strip().upper()
        comp_obj = {'Remedy': remedy_pred, 'Source': '', 'Chemical Composition': ''}
        try:
            match = composition_df[composition_df['Remedy'] == remedy_key]
            if not match.empty:
                comp_obj['Source'] = str(match['Source'].iloc[0]) if 'Source' in match.columns else ''
                comp_obj['Chemical Composition'] = str(match['Chemical Composition'].iloc[0]) if 'Chemical Composition' in match.columns else ''
        except Exception:
            pass

        # Dosage lookup
        age_cat = age_category(age)
        dosage_obj = {
            'Concentration': None,
            'Dosage': 'Not available',
            'Timing': None,
            'Age Category': age_cat,
            'Gender': 'M' if gender == 'M' else ('F' if gender == 'F' else 'Other')
        }
        try:
            if dosage_df is not None and all(col in dosage_df.columns for col in ['Remedy', 'Age Category', 'Gender']):
                # case-insensitive match on remedy and gender
                df = dosage_df.copy()
                df['Remedy'] = df['Remedy'].astype(str)
                df['Gender'] = df['Gender'].astype(str)
                match = df[
                    (df['Remedy'].str.lower() == remedy_pred.lower()) &
                    (df['Age Category'] == age_cat) &
                    (df['Gender'].str.upper() == (gender if gender in ('M', 'F') else gender))
                ]
                if not match.empty:
                    row0 = match.iloc[0]
                    dosage_obj['Concentration'] = str(row0.get('Concentration') or '') or None
                    dosage_obj['Dosage'] = str(row0.get('Dosage') or 'Not available')
                    dosage_obj['Timing'] = str(row0.get('Timing') or '') or None
        except Exception:
            pass

        result = {
            'predicted': {
                'UrgencyScore': round(score_pred, 2),
                'UrgencyCategory': urgency_category,
                'Remedy': remedy_pred
            },
            'dosage': dosage_obj,
            'composition': comp_obj,
            'fallbackUsed': fallback_used
        }

        sys.stdout.write(json.dumps(result))
        sys.stdout.flush()
    except Exception as e:
        sys.stdout.write(json.dumps({'error': str(e)}))
        sys.stdout.flush()


if __name__ == '__main__':
    main()
