from flask import Flask, request, jsonify, redirect, url_for
import pickle
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load models
with open('/mnt/data/breast_cancer.pkl', 'rb') as f:
    breast_cancer_pipeline = pickle.load(f)

with open('/mnt/data/heart_rf.pkl', 'rb') as f:
    heart_disease_pipeline = pickle.load(f)

@app.route('/')
def home():
    return "Welcome to the Medical Prediction API! Use /predict_breast_cancer or /predict_heart_disease."

@app.route('/predict_breast_cancer', methods=['POST'])
def predict_breast_cancer():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = breast_cancer_pipeline.predict(features)
    if prediction[0] == 1:
        return redirect(url_for('positive_cancer'))
    return redirect(url_for('negative_cancer'))

@app.route('/predict_heart_disease', methods=['POST'])
def predict_heart_disease():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = heart_disease_pipeline.predict(features)
    if prediction[0] == 1:
        return redirect(url_for('positive_heart'))
    return redirect(url_for('negative_heart'))

@app.route('/positive_cancer')
def positive_cancer():
    return "Breast Cancer Prediction: Positive"

@app.route('/negative_cancer')
def negative_cancer():
    return "Breast Cancer Prediction: Negative"

@app.route('/positive_heart')
def positive_heart():
    return "Heart Disease Prediction: Positive"

@app.route('/negative_heart')
def negative_heart():
    return "Heart Disease Prediction: Negative"

if __name__ == '__main__':
    app.run(debug=True)
