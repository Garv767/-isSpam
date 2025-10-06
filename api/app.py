from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all origins and all routes. 
CORS(app) 

try:
    model = pickle.load(open('models/logistic_regression.pkl', 'rb'))
    feature_extraction = pickle.load(open('models/feature_extraction.pkl', 'rb'))
    print("Model and Vectorizer loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model or Vectorizer files not found. Ensure 'logistic_regression.pkl' and 'feature_extraction.pkl' are in the same directory.")
    model = None
    feature_extraction = None


def predict_mail(input_text):
    """Handles the text transformation and prediction."""
    if not model or not feature_extraction:
        return ["error"]
    
    input_user_mail = [input_text]
    input_data_features = feature_extraction.transform(input_user_mail)
    prediction = model.predict(input_data_features)
    return prediction.tolist()


# app.py
@app.route('/predict', methods=['POST'])
def classify_email_api():

    # Get Prediction
    predicted_mail_list = predict_mail(input_text=mail)

    # Robust check for error case
    if predicted_mail_list[0] == "error":
        return jsonify({"error": "Internal prediction service failure"}), 500

    # Return JSON Response: Get the single integer value (0 or 1) from the list.
    return jsonify({
        "prediction": predicted_mail_list[0]
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    # Check if assets are loaded and the app is ready to serve traffic
    if model and feature_extraction:
        return jsonify({"status": "healthy", "service": "spam-classifier"}), 200
    else:
        return jsonify({"status": "unhealthy", "service": "spam-classifier"}), 503


if __name__ == '__main__':
    app.run(debug=True, port=5000)