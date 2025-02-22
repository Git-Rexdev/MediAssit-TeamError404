import flask 
from flask import Flask, request, jsonify
import pickle
import numpy as np

# Load the trained model and scaler
with open('breast_cancer.pkl', 'rb') as model_file:
    data = pickle.load(model_file)
    model = data['model']
    scaler = data['scaler']

# Initialize Flask app
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        input_data = request.json['features']  # Expecting a list of feature values
        input_array = np.array(input_data).reshape(1, -1)
        
        # Scale input data
        input_scaled = scaler.transform(input_array)
        
        # Make prediction
        prediction = model.predict(input_scaled)
        
        return jsonify({'prediction': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
