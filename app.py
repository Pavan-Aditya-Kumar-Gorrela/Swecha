import cv2
import numpy as np
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO  # For YOLOv8
from keras.models import load_model

app = Flask(__name__)
CORS(app)

# Load YOLOv8s model
person_detector = YOLO(r"C:\\Users\\user\\Desktop\\admin\\backend\\yolov8s.pt")  

# Load gender classification model
gender_model = load_model(r'C:\\Users\\user\\Desktop\\admin\\backend\\gender_classification.keras') 

# Load hand gesture detection model
gesture_model = load_model(r'C:\\Users\\user\\Desktop\\admin\\backend\\my_gest.h5')

# Process the webcam feed frame
@app.route('/api/process-frame', methods=['POST'])
def process_frame():
    data = request.json
    image_data = data['image']

    # Decode the base64 image string
    try:
        encoded_data = image_data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({"error": "Failed to decode image", "details": str(e)}), 400

    # Use YOLOv8 to detect persons in the frame
    results = person_detector(frame)
    
    men_count, women_count = 0, 0
    alerts = []

    # Loop over detected objects
    for result in results[0].boxes:
        class_id = int(result.cls[0])  # Get the class ID of the detected object
        if class_id == 0:  # Assuming 0 is the ID for 'person' (check your model's class mapping)
            x1, y1, x2, y2 = map(int, result.xyxy[0])  # Bounding box coordinates

            # Extract the person's image using bounding box
            person_img = frame[y1:y2, x1:x2]

            # Classify the person's gender
            gender = classify_gender(person_img)
            if gender == "male":
                men_count += 1
            else:
                women_count += 1

            # If lone woman detected, send yellow alert
            if women_count == 1:
                alerts.append({"message": "Lone woman detected", "color": "yellow"})

            # Detect hand gestures for SOS alert
            hand_gesture = detect_hand_gesture(person_img)
            if hand_gesture == 0:
                alerts.append({"message": "SOS alert! Help required", "color": "red"})

    # Update gender distribution pie chart
    gender_distribution = {
        "labels": ["Male", "Female"],
        "datasets": [
            {
                "label": "Gender Distribution",
                "data": [men_count, women_count],
                "backgroundColor": ["#36A2EB", "#FF6384"],
                "hoverBackgroundColor": ["#36A2EB", "#FF6384"],
            }
        ]
    }

    return jsonify({
        "genderDistribution": gender_distribution,
        "alerts": alerts
    })

# Helper function to classify gender
def classify_gender(image):
    # Resize the image to the expected shape (100, 100, 3)
    image = cv2.resize(image, (100, 100))
    
    # Preprocess the image
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = image / 255.0  # Normalize the image
    
    # Predict gender using the model
    prediction = gender_model.predict(image)
    
    # Check if prediction[0] is an array and handle it
    if isinstance(prediction[0], np.ndarray):
        gender_confidence = prediction[0][0]  # Assuming binary classification (male/female)
    
    # Interpret prediction
    return "male" if gender_confidence > 0.5 else "female"


# Helper function to detect hand gestures
def detect_hand_gesture(image):
    image = cv2.resize(image, (150, 150))  # Resize to match the model's expected input
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = image / 255.0  # Normalize the image

    prediction = gesture_model.predict(image)  # Make prediction
    class_label = np.argmax(prediction)  # Get the predicted class label
    confidence = np.max(prediction)  # Get the confidence level of the prediction

    # Set a threshold for confidence
    threshold = 0.9  # You can adjust this value as needed (0 to 1)

    # Check if the SOS gesture is detected with sufficient confidence
    if class_label == 0 and confidence >= threshold:
        return class_label  # SOS detected
    else:
        return -1  # No gesture detected or confidence not sufficient



# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3000)
