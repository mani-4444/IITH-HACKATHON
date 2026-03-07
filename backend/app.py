"""
Flask backend for Manufacturing Batch Prediction.
Updated for actual model inputs (13 features).
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import traceback

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)

def get_artifact(name):
    path = os.path.join(BASE_DIR, name)
    if not os.path.exists(path):
        return None
    return joblib.load(path)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Load the new models & transformers
        model = get_artifact("model.pkl") or get_artifact("track_a_rf_model.pkl")
        scaler = get_artifact("scaler.pkl")
        pca = get_artifact("pca.pkl")
        le = get_artifact("label_encoder.pkl")
        imputer = get_artifact("imputer.pkl")

        if not all([model, scaler, pca, le, imputer]):
            missing = []
            if not model: missing.append("model.pkl")
            if not scaler: missing.append("scaler.pkl")
            if not pca: missing.append("pca.pkl")
            if not le: missing.append("label_encoder.pkl")
            if not imputer: missing.append("imputer.pkl")
            return jsonify({
                "error": f"Missing artifacts in backend folder: {', '.join(missing)}. Please upload them."
            }), 400

        data = request.get_json(force=True)

        # 2. Extract Base Features from frontend
        time_minutes = float(data.get("time_minutes", 120))
        temperature = float(data.get("temperature", 60))
        pressure = float(data.get("pressure", 1.0))
        humidity = float(data.get("humidity", 45))
        motor_speed = float(data.get("motor_speed", 150))
        comp_force = float(data.get("compression_force", 30))
        flow_rate = float(data.get("flow_rate", 60))
        phase_str = data.get("phase", "Compression")
        current_power = float(data.get("current_power", 35.0)) # Need this for feature engineering

        # 3. Encoding Phase
        try:
             phase_encoded = float(le.transform([phase_str])[0])
        except Exception:
             # Fallback if unrecognised Phase
             phase_encoded = 0.0

        # We can bypass the imputer completely since the values are 
        # guaranteed to be floats and not NaN (due to `float(data.get(...))` fallback).
        # This dodges a scikit-learn version mismatch issue (e.g. `_fill_dtype` attribute).
        t_min, temp, press, hum, m_speed, c_force, f_rate = time_minutes, temperature, pressure, humidity, motor_speed, comp_force, flow_rate

        # 4. Feature Engineering
        temp_x_pressure = temp * press
        speed_x_force = m_speed * c_force
        humidity_temp_ratio = hum / (temp + 1e-9)
        flow_per_power = f_rate / (current_power + 1e-9)
        pressure_humidity = press * hum

        # 5. Assemble final 13 features matrix
        # ['Time_Minutes', 'Temperature_C', 'Pressure_Bar', 'Humidity_Percent', 'Motor_Speed_RPM', 
        #  'Compression_Force_kN', 'Flow_Rate_LPM', 'Phase_encoded', 'Temp_x_Pressure', 'Speed_x_Force', 
        #  'Humidity_Temp_ratio', 'Flow_per_Power', 'Pressure_Humidity']
        X_new = np.array([[
            t_min, temp, press, hum, m_speed, c_force, f_rate, phase_encoded,
            temp_x_pressure, speed_x_force, humidity_temp_ratio, flow_per_power, pressure_humidity
        ]])

        # 6. Scale and PCA
        X_new_sc = scaler.transform(X_new)
        X_new_pca = pca.transform(X_new_sc)

        # 7. Predict
        preds = model.predict(X_new_pca)[0]

        # Target 0 = Power Consumption, Target 1 = Vibration
        power_pred = float(preds[0])
        vib_pred = float(preds[1])

        return jsonify({
            "power": round(power_pred, 2),
            "vibration": round(vib_pred, 3)
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
