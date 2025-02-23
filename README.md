<!-- # Techanton-Error404
This is a repository to showcase a medical domain project created by Team Error-404 from SGU, Kolhapur at Techathon 2.0, AISSMS, Pune. For more info read Readme file -->

# MedAssist - Healthcare Management System

![MedAssist Banner](static/images/Banner.png)

## Overview
MedAssist is a healthcare management web application designed to streamline medical services such as appointment booking, health prediction, OCR-based medical report summarization, patient search, and chatbot assistance. 

## Features
### Appointment Booking
- Users can book appointments with doctors via an interactive scheduling system.
- **Doctors' availability is updated in real-time.**

### Dashboard
- Provides an **intuitive interface** to manage upcoming appointments, alerts, and patient information.
- **Live notifications** for new bookings and health alerts.

### AI-Powered Health Prediction
- Supports **heart disease, diabetes, cancer, fractures, and brain tumors predictions**.
- **Uses machine learning models** trained on medical datasets.

### OCR-Based Medical Report Summarization
- Users can **upload blood reports** for instant AI-driven analysis.
- The system **extracts and highlights key medical indicators**.

### Patient Search
- **Advanced filtering and sorting options** to locate patient records quickly.
- **Secure access** to sensitive medical data.

### AI Medical Chatbot
- Integrated AI chatbot using **Gemini-Pro** and **Llama3.2**.
- **Fetches medical references from PubMed** for evidence-based answers.

### Medical Image Processing
- Uses **YOLO-based** object detection for **X-ray, MRI, and CT-scan analysis**.

### Disease Prediction APIs
- Supports **breast cancer and heart disease predictions** using machine learning models.

## File Structure
```
📂 MedAssist
├── 📂 templates
│   ├── index.html          # Landing page with services overview
│   ├── login.html          # User authentication page
│   ├── appointments.html   # Displays available doctors for appointment booking
│   ├── book_appointment.html  # Appointment booking form
│   ├── dashboard.html      # Doctor's dashboard
│   ├── health_pred.html    # AI-powered health prediction system
│   ├── ocr.html           # Blood report summarization
│   ├── patient_search.html # Search interface for patient records
│   ├── profile.html        # Doctor's profile page
├── 📂 static
│   ├── images/             # UI assets & illustrations
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
├── advance_chatbot.py      # AI-powered chatbot (Gemini-Pro, PubMed integration)
├── chatbot.py              # FastAPI-based chatbot (Llama3.2, patient detail retrieval)
├── flask_app.py            # Backend handling (Flask, disease prediction, OCR)
└── README.md               # This file
```

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Git-Rexdev/Techathon-Error404.git
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - Add `GEMINI_API_KEY` to a `.env` file for chatbot integration.
4. Run the application:
   ```sh
   python flask_app.py
   ```
5. Install and set up Ollama locally:
   - Download and install Ollama from the official website: [https://ollama.ai](https://ollama.ai)
   - Verify installation by running:
     ```sh
     ollama --version
     ```
   - Pull the required Llama model:
     ```sh
     ollama pull llama3
     ```
   - Ensure the Ollama service is running in the background:
     ```sh
     ollama serve
     ```
6. Run command in terminal 
   ``` uvicorn chatbot:app --host 0.0.0.0 --port 8000 --reload ```


## Technologies Used
### Frontend
- HTML, CSS, JavaScript
- Interactive UI with **FontAwesome**

### Backend
- **Flask** (API handling & application logic)
- **FastAPI** (High-performance chatbot integration)

### AI & Machine Learning
- **Google Gemini API** for chatbot intelligence
- **Langchain Llama3.2** for NLP-based medical assistant
- **YOLO Object Detection** for medical image processing
- **OpenCV** for image manipulation
- **PubMed API** for retrieving academic medical references
- **Scikit-Learn** for disease prediction models

## Contributing
- Fork the repository and submit a **pull request** with your improvements.
- **Bug reports & feature requests** are welcome via GitHub Issues.
