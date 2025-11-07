import pandas as pd
import joblib
from pathlib import Path
# Load remedy composition dataset
composition_df = pd.read_csv("artifacts/data/Remedy_Composition_FINAL_Merged.csv")
composition_df['Remedy'] = composition_df['Remedy'].str.strip().str.upper()


# Load training data for symptoms
training_df = pd.read_csv("artifacts/data/Balanced_SPID_Dataset.csv")
symptom_columns = training_df.drop(columns=['SPID', 'Remedy', 'UrgencyScore', 'UrgencyCategory', 'UrgencyCategoryEncoded', 'Condition'], errors='ignore').columns.tolist()

# Load ML models (use pathlib to avoid Windows backslash escape issues)
model_dir = Path(__file__).resolve().parent / "artifacts" / "model"
clfu = joblib.load(str(model_dir / "balanced_urgency_classifier.pkl"))
reg = joblib.load(str(model_dir / "urgency_gb_regressor.pkl"))
clfr = joblib.load(str(model_dir / "balanced_remedy_classifier.pkl"))

# Load dosage dataset
dosage_df = pd.read_csv("artifacts/data/Complete_Remedy_Dosage_Dataset.xls")
dosage_df.columns = [col.strip() for col in dosage_df.columns]  # remove leading/trailing spaces

def get_composition_details(predicted_remedy):
    remedy = predicted_remedy.strip().upper()
    match = composition_df[composition_df['Remedy'] == remedy]
    
    if match.empty:
        return f"❗ Chemical composition for remedy '{predicted_remedy}' not found."
    
    source = match['Source'].values[0]
    composition = match['Chemical Composition'].values[0]
    
    return (
        f"\n Detailed Composition of {predicted_remedy}\n"
        f" Source: {source}\n"
        f" Chemical Composition (approx. ratios):\n{composition}"
    )
# Utility function
def get_age_category(age):
    if age <= 12:
        return "Child"
    elif age <= 18:
        return "Adolescent"
    elif age <= 60:
        return "Adult"
    else:
        return "Senior"

# Get inputs
print("Enter symptom severity values (0–3). Press Enter to skip any symptom (default = 0):")
user_input = {}
for symptom in symptom_columns:
    try:
        val = input(f"{symptom}: ")
        user_input[symptom] = int(val) if val.strip() != '' else 0
    except ValueError:
        print("Invalid input. Defaulting to 0.")
        user_input[symptom] = 0

age = int(input("Enter your age: "))
gender = input("Enter your gender (M/F): ").strip().upper()
age_category = get_age_category(age)

input_df = pd.DataFrame([user_input])[symptom_columns]
non_zero_symptoms = input_df.loc[:, (input_df > 0).any()].columns.tolist()

# Default fallback mapping
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
    }
}

# Handle user case
if len(non_zero_symptoms) == 0:
    print("No symptoms provided. Please enter at least one symptom.")
elif len(non_zero_symptoms) == 1:
    symptom = non_zero_symptoms[0]
    generic_remedy = fallback_remedy_map.get(symptom, "General Supportive Remedy")
    print("--------------------------------------------------")
    print("Only one symptom detected. Here's a general recommendation:")
    print(f"Symptom              : {symptom}")
    if isinstance(generic_remedy, dict):
        print(f"Suggested Remedy     : {generic_remedy['remedy']}")
        print(f"Dosage               : {generic_remedy['dosage']}")
        print(f"Concentration        : {generic_remedy['concentration']}")
        print(f"Timing               : {generic_remedy['timing']}")
    else:
        print(f"Suggested Remedy     : {generic_remedy}")
    print("Note: This is a general remedy based on minimal input.")
    print("--------------------------------------------------")
else:
    # Make predictions
    predicted_category = clfu.predict(input_df)[0]
    predicted_score = reg.predict(input_df)[0]
    predicted_remedy = clfr.predict(input_df)[0]
    category_map = {1: "Low", 2: "Moderate", 3: "High"}

    # Match dosage info
    match = dosage_df[
        (dosage_df['Remedy'].str.lower() == predicted_remedy.lower()) &
        (dosage_df['Age Category'] == age_category) &
        (dosage_df['Gender'].str.upper() == gender)
    ]

    if not match.empty:
        dosage_info = match.iloc[0]
        dosage_sentence = (
            f"For {age_category.lower()} {('males' if gender == 'M' 
                                           else 'females')} prescribed "
            f"{predicted_remedy.title()}, the recommended dosage is **{dosage_info['Dosage']}** of "
            f"**{dosage_info['Concentration']}** potency, to be taken **{dosage_info['Timing']}**."
        )
    else:
        dosage_sentence = " Dosage information not found for the provided information."

    # Display results
    print("--------------------------------------------------")
    print("Prediction Result")
    print("--------------------------------------------------")
    print(f"Predicted Urgency Score     : {predicted_score:.2f}")
    print(f"Predicted Urgency Category  : {category_map[predicted_category]}")
    print(f"Predicted Remedy            : {predicted_remedy}")
    print("--------------------------------------------------")
    print("Personalized Dosage Recommendation:")
    print(dosage_sentence)
    print("--------------------------------------------------")
    print(get_composition_details(predicted_remedy))
