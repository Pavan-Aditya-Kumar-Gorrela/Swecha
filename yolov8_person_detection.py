import torch

# Load YOLOv8s model
model = torch.hub.load('ultralytics/yolov8', 'yolov8s', pretrained=True)

# Function to detect persons
def detect_persons(frame):
    results = model(frame)
    persons = []
    for result in results.xyxy[0]:
        if result[5] == 0:  # 0 is the class for 'person'
            x1, y1, x2, y2 = map(int, result[:4])
            persons.append(frame[y1:y2, x1:x2])  # Crop person
    return persons
