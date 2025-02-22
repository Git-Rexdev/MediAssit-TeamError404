from flask import Flask, request, jsonify, redirect, url_for, render_template
import pickle
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from pydantic import BaseModel
import pandas as pd

app = Flask(__name__, static_folder='static', template_folder='templates')

with open(r'pickle\breast_cancer.pkl', 'rb') as f:
    breast_cancer_pipeline = pickle.load(f)

with open(r'pickle\heart_rf.pkl', 'rb') as f:
    heart_disease_pipeline = pickle.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/appointments')
def appointments():
    return render_template('appointments.html')

@app.route('/book_appointment')
def book_appointment():
    return render_template('book_appointment.html') 

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/ocr')
def ocr():
    return render_template('ocr.html')

@app.route('/health_pred')
def health_pred():
    return render_template('health_pred.html')

# API route to predict Breast Cancer
@app.route('/predict_breast_cancer', methods=['POST'])
def predict_breast_cancer():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)  # Convert input to NumPy array
        prediction = breast_cancer_pipeline.predict(features)
        result = "Positive" if prediction[0] == 1 else "Negative"
        return jsonify({'status': 'success', 'prediction': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# API route to predict Heart Disease
@app.route('/predict_heart_disease', methods=['POST'])
def predict_heart_disease():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)  # Convert input to NumPy array
        prediction = heart_disease_pipeline.predict(features)
        result = "Positive" if prediction[0] == 1 else "Negative"
        return jsonify({'status': 'success', 'prediction': result})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

def fetch_patient_details(patient_name):
    df = pd.read_csv("patients.csv")
    df["Name"] = df["Name"].str.strip().str.lower()  
    patient_name = patient_name.strip().lower()  

    patient_data = df[df["Name"] == patient_name] 

    if not patient_data.empty:
        return patient_data.to_dict(orient="records")[0]
    else:
        return None

class PatientSearchRequest(BaseModel):
    patient_name: str

@app.post("/search-patient")
async def search_patient(request: PatientSearchRequest):
    patient_details = fetch_patient_details(request.patient_name)
    if patient_details:
        return {"status": "success", "patient_details": patient_details}
    else:
        return {"status": "error", "message": "Patient not found"}

if __name__ == '__main__':
    app.run(debug=True)
