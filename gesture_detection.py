from keras.models import load_model
import cv2

# Load pre-trained gesture detection model
gesture_model = load_model(r'C:\\Users\\user\\Desktop\\admin\\backend\\gesture_model.h5')

# Function to detect gestures (class label = 0 is SOS gesture)
def detect_gesture(frame):
    frame_resized = cv2.resize(frame, (150, 150))
    frame_resized = frame_resized.reshape(1, 150, 150, 3)
    prediction = gesture_model.predict(frame_resized)
    return prediction[0][0] == 0
