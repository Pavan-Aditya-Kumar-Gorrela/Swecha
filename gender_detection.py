from keras.models import load_model
import cv2

# Load pre-trained gender detection model
gender_model = load_model(r'C:\\Users\\user\\Desktop\\admin\\backend\\gender_classification.keras')

# Function to detect gender
def detect_gender(person_img):
    person_img = cv2.resize(person_img, (100, 100))
    person_img = person_img.reshape(1, 100, 100, 3)
    prediction = gender_model.predict(person_img)
    return "male" if prediction[0][0] > 0.5 else "female"
