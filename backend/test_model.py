import joblib
import numpy as np
import traceback

try:
    print("Loading model...")
    model = joblib.load("model.pkl")
    print("Model loaded successfully!")
    
    # Simulate an incoming request payload
    batch_size = 200.0
    temperature = 250.0
    hold_time = 30.0
    machine_speed = 60.0
    material_type = 0  # Assuming 'A'
    
    features = np.array([[batch_size, temperature, hold_time, machine_speed, material_type]])
    preds = model.predict(features)[0]
    
    print(f"Predictions: {preds}")
except Exception as e:
    print("Error during prediction:")
    traceback.print_exc()
