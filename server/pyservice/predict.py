import pandas as pd
import joblib
import json
import sys
from pathlib import Path

# Load data and models
base_dir = Path(__file__).resolve().parent.parent.parent / "artifacts"
composition_df = pd.read_csv(base_dir / "data" / "Remedy_Composition_FINAL_Merged.csv")
composition_df['Remedy'] = composition_df['Remedy'].str.strip().str.upper()

training_df = pd.read_csv(base_dir / "data" / "Balanced_SPID_Dataset.csv")
symptom_columns = training_df.drop(columns=['SPID', 'Remedy', 'UrgencyScore', 'UrgencyCategory', 'UrgencyCategoryEncoded', 'Condition'], errors='ignore').columns.tolist()

model_dir = base_dir / "model"
clfu = joblib.load(model_dir / "balanced_urgency_classifier.pkl")
reg = joblib.load(model_dir / "urgency_gb_regressor.pkl")
clfr = joblib.load(model_dir / "balanced_remedy_classifier.pkl")

dosage_df = pd.read_csv(base_dir / "data" / "Complete_Remedy_Dosage_Dataset.xls")
dosage_df.columns = [col.strip() for col in dosage_df.columns]

def get_composition_details(predicted_remedy):
    remedy = predicted_remedy.strip().upper()
    match = composition_df[composition_df['Remedy'] == remedy]
    if match.empty:
        return {
            "Remedy": predicted_remedy,
            "Source": "Not found",
            "Chemical Composition": f"❗ Chemical composition for remedy '{predicted_remedy}' not found."
        }
    return {
        "Remedy": predicted_remedy,
        "Source": match['Source'].values[0],
        "Chemical Composition": match['Chemical Composition'].values[0]
    }

def get_age_category(age):
    if age <= 12:
        return "Child"
    elif age <= 18:
        return "Adolescent"
    elif age <= 60:
        return "Adult"
    else:
        return "Senior"

fallback_remedy_map = {
    'Cough': {
        'remedy': 'Bryonia alba',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': 'Twice daily after meals'
    },
    'Fever': {
        'remedy': 'Aconitum napellus',
        'concentration': '200C',
        'dosage': '2 drops in water',
        'timing': 'Thrice daily until fever subsides'
    },
    'Headache': {
        'remedy': 'Belladonna',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': 'Every 4 hours until relief'
    },
    'Fatigue': {
        'remedy': 'Gelsemium sempervirens',
        'concentration': '30C',
        'dosage': '2 tablets',
        'timing': 'Twice a day'
    },
    'Skin Rash': {
        'remedy': 'Sulphur',
        'concentration': '200C',
        'dosage': '3 pellets',
        'timing': 'Once daily in the morning'
    },
    'Runny Nose': {
        'remedy': 'Allium cepa',
        'concentration': '30C',
        'dosage': '2 drops',
        'timing': 'Every 3 hours'
    },
    'Sore Throat': {
        'remedy': 'Hepar sulphuris',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': 'Twice daily'
    },
    'Body Ache': {
        'remedy': 'Rhus toxicodendron',
        'concentration': '30C',
        'dosage': '3 tablets',
        'timing': 'Morning and evening'
    },
    'Nausea': {
        'remedy': 'Nux vomica',
        'concentration': '30C',
        'dosage': '5 drops in water',
        'timing': 'Before meals'
    },
    'Constipation': {
        'remedy': 'Opium',
        'concentration': '200C',
        'dosage': '3 pellets',
        'timing': 'Once every morning'
    },
    'Diarrhea': {
        'remedy': 'Aloe socotrina',
        'concentration': '30C',
        'dosage': '2 drops',
        'timing': 'After every loose stool'
    },
    'Vomiting': {
        'remedy': 'Ipecacuanha',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': 'Twice daily'
    },
    'Back Pain': {
        'remedy': 'Kali carbonicum',
        'concentration': '30C',
        'dosage': '3 tablets',
        'timing': 'Twice daily after food'
    },
    'Joint Pain': {
        'remedy': 'Bryonia alba',
        'concentration': '200C',
        'dosage': '2 drops in water',
        'timing': 'Morning and evening'
    },
    'Insomnia': {
        'remedy': 'Coffea cruda',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': '30 minutes before bed'
    },
    'Anxiety': {
        'remedy': 'Argentum nitricum',
        'concentration': '30C',
        'dosage': '2 tablets',
        'timing': 'Thrice daily'
    },
    'Depression': {
        'remedy': 'Ignatia amara',
        'concentration': '200C',
        'dosage': '5 pellets',
        'timing': 'Morning and night'
    },
    'Burning Sensation': {
        'remedy': 'Cantharis',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': 'Every 4 hours'
    },
    'Swelling': {
        'remedy': 'Apis mellifica',
        'concentration': '30C',
        'dosage': '2 tablets',
        'timing': 'Twice a day'
    },
    'Indigestion': {
        'remedy': 'Carbo vegetabilis',
        'concentration': '30C',
        'dosage': '5 drops',
        'timing': 'After meals'
    },
    'Chest Pain': {
        'remedy': 'Cactus grandiflorus',
        'concentration': '30C',
        'dosage': '3 pellets',
        'timing': 'Every 4 hours'
    }
}

def predict(input_data):
    symptoms = input_data['symptoms']
    age = input_data['age']
    gender = input_data['gender'].upper()
    age_category = get_age_category(age)

    # Validate symptoms
    invalid_symptoms = [s for s in symptoms if s not in symptom_columns]
    if invalid_symptoms:
        return {"error": f"Invalid symptoms: {invalid_symptoms}. Valid: {symptom_columns}"}

    # Validate gender
    if gender not in ['M', 'F', 'OTHER']:
        return {"error": f"Invalid gender: {gender}. Valid: M, F, Other"}

    user_input = {s: symptoms.get(s, 0) for s in symptom_columns}
    input_df = pd.DataFrame([user_input])[symptom_columns]
    non_zero_symptoms = [s for s, v in symptoms.items() if v > 0]

    if len(non_zero_symptoms) == 0:
        return {"error": "No symptoms provided. Please enter at least one symptom."}
    elif len(non_zero_symptoms) == 1:
        symptom = non_zero_symptoms[0]
        generic_remedy = fallback_remedy_map.get(symptom)
        if not generic_remedy:
            return {"error": f"No fallback for single symptom: {symptom}"}
        return {
            "predicted": {
                "UrgencyScore": None,
                "UrgencyCategory": None,
                "Remedy": generic_remedy['remedy']
            },
            "dosage": {
                "Concentration": generic_remedy['concentration'],
                "Dosage": generic_remedy['dosage'],
                "Timing": generic_remedy['timing'],
                "Age Category": age_category,
                "Gender": gender
            },
            "composition": get_composition_details(generic_remedy['remedy']),
            "fallbackUsed": True
        }
    else:
        # Predictions
        predicted_category = clfu.predict(input_df)[0]
        predicted_score = reg.predict(input_df)[0]
        predicted_remedy = clfr.predict(input_df)[0]
        category_map = {1: "Low", 2: "Moderate", 3: "High"}

        # Dosage
        match = dosage_df[
            (dosage_df['Remedy'].str.lower() == predicted_remedy.lower()) &
            (dosage_df['Age Category'] == age_category) &
            (dosage_df['Gender'].str.upper() == gender)
        ]
        if not match.empty:
            dosage_info = match.iloc[0]
            dosage = {
                "Concentration": dosage_info['Concentration'],
                "Dosage": dosage_info['Dosage'],
                "Timing": dosage_info['Timing'],
                "Age Category": age_category,
                "Gender": gender
            }
        else:
            dosage = {
                "Concentration": None,
                "Dosage": "Dosage information not found.",
                "Timing": None,
                "Age Category": age_category,
                "Gender": gender
            }

        return {
            "predicted": {
                "UrgencyScore": round(predicted_score, 2),
                "UrgencyCategory": category_map[predicted_category],
                "Remedy": predicted_remedy
            },
            "dosage": dosage,
            "composition": get_composition_details(predicted_remedy),
            "fallbackUsed": False
        }

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    result = predict(input_data)
    print(json.dumps(result))
