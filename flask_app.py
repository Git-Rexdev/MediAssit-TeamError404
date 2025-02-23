from flask import Flask, request, jsonify, redirect, url_for, render_template, send_file
import pickle
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from pydantic import BaseModel
import pandas as pd
import cv2
from supervision import Detections, BoundingBoxAnnotator, LabelAnnotator
import os
from pymongo import MongoClient

client = MongoClient("mongodb+srv://yrane4616:y%40S%23rane46@medicare.j9svm.mongodb.net/?retryWrites=true&w=majority&appName=MediCare")  
db = client["hospital_db"]  
doctors_collection = db["doctor_data"]

app = Flask(__name__, static_folder='static', template_folder='templates')

with open("pickle/brain_tumor.pkl", "rb") as f:
    yolo_model = pickle.load(f)

with open(r'pickle/breast_cancer.pkl', 'rb') as f:
    breast_cancer_pipeline = pickle.load(f)

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

@app.route('/health_pred')
def health_pred():
    return render_template('health_pred.html')

@app.route('/profile')
def profile():
    doctor = doctors_collection.find_one({}, {"_id": 0})  # Fetch one doctor (modify as needed)
    if doctor:
        return render_template('profile.html', doctor=doctor)
    else:
        return "Doctor not found", 404
    
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
    
def fetch_patient_details(patient_name):
    df = pd.read_csv("patients.csv")
    df["Name"] = df["Name"].str.strip().str.lower()  
    patient_name = patient_name.strip().lower()  

    patient_data = df[df["Name"] == patient_name] 

    if not patient_data.empty:
        return patient_data.to_dict(orient="records")[0]
    else:
        return None

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(input_image_path, output_image_path):
    image = cv2.imread(input_image_path)
    if image is None:
        print("Error: Unable to read the image.")
        return

    resized = cv2.resize(image, (640, 640))
    detections = Detections.from_ultralytics(yolo_model(resized)[0])
    annotated = BoundingBoxAnnotator().annotate(scene=resized, detections=detections)
    annotated = LabelAnnotator().annotate(scene=annotated, detections=detections)

    cv2.imwrite(output_image_path, annotated)
    print(f"Processed and saved: {output_image_path}")

@app.route('/ocr', methods=['GET', 'POST'])
def ocr():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part'
        file = request.files['file']
        if file.filename == '':
            return 'No selected file'
        if file and allowed_file(file.filename):
            filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filename)
            output_filename = os.path.join(app.config['OUTPUT_FOLDER'], 'annotated_' + file.filename)
            process_image(filename, output_filename)
            return send_file(output_filename, mimetype='image/jpeg')
    return render_template('ocr.html')


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

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)


    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)  # No debug mode in production


