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
NOMINAL_POWER_KW = 35.0

CLEAN_ARTIFACTS = {
    "model": "track_a_rf_model_clean.pkl",
    "scaler": "scaler_clean.pkl",
    "pca": "pca_clean.pkl",
    "label_encoder": "label_encoder_clean.pkl",
}


def canonical_phase_name(value):
    """Normalize phase names for tolerant matching across UI/dataset formats."""
    if value is None:
        return ""
    return "".join(ch for ch in str(value).lower() if ch.isalnum())


def resolve_phase_label(raw_phase, label_encoder):
    """Map incoming phase aliases to the exact class name known by the encoder."""
    phase_text = str(raw_phase or "")
    classes = [str(c) for c in getattr(label_encoder, "classes_", [])]
    if phase_text in classes:
        return phase_text

    by_canonical = {canonical_phase_name(c): c for c in classes}
    mapped = by_canonical.get(canonical_phase_name(phase_text))
    return mapped or phase_text


def load_inference_bundle():
    """Prefer clean artifacts; fall back to legacy artifacts for compatibility."""
    clean_bundle = {
        "model": get_artifact(CLEAN_ARTIFACTS["model"]),
        "scaler": get_artifact(CLEAN_ARTIFACTS["scaler"]),
        "pca": get_artifact(CLEAN_ARTIFACTS["pca"]),
        "label_encoder": get_artifact(CLEAN_ARTIFACTS["label_encoder"]),
        "mode": "clean",
    }
    if all([
        clean_bundle["model"],
        clean_bundle["scaler"],
        clean_bundle["pca"],
        clean_bundle["label_encoder"],
    ]):
        return clean_bundle

    legacy_bundle = {
        "model": get_artifact("model.pkl") or get_artifact("track_a_rf_model.pkl"),
        "scaler": get_artifact("scaler.pkl"),
        "pca": get_artifact("pca.pkl"),
        "label_encoder": get_artifact("label_encoder.pkl"),
        "mode": "legacy",
    }
    return legacy_bundle

def get_artifact(name):
    path = os.path.join(BASE_DIR, name)
    if not os.path.exists(path):
        return None
    try:
        return joblib.load(path)
    except Exception:
        # Keep runtime alive when an artifact was serialized with an
        # incompatible Python / library version.
        traceback.print_exc()
        return None

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1. Load model bundle (clean preferred, legacy fallback)
        bundle = load_inference_bundle()
        model = bundle["model"]
        scaler = bundle["scaler"]
        pca = bundle["pca"]
        le = bundle["label_encoder"]
        mode = bundle["mode"]

        if not all([model, scaler, pca, le]):
            missing = []
            if mode == "clean":
                if not model:
                    missing.append(CLEAN_ARTIFACTS["model"])
                if not scaler:
                    missing.append(CLEAN_ARTIFACTS["scaler"])
                if not pca:
                    missing.append(CLEAN_ARTIFACTS["pca"])
                if not le:
                    missing.append(CLEAN_ARTIFACTS["label_encoder"])
            else:
                if not model:
                    missing.append("model.pkl or track_a_rf_model.pkl")
                if not scaler:
                    missing.append("scaler.pkl")
                if not pca:
                    missing.append("pca.pkl")
                if not le:
                    missing.append("label_encoder.pkl")
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
        phase_label = resolve_phase_label(phase_str, le)

        # 3. Encoding Phase
        try:
               phase_encoded = float(le.transform([phase_label])[0])
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
        pressure_humidity = press * hum

        if mode == "clean":
            # Leakage-free 12 feature vector (Flow_per_Power removed).
            X_new = np.array([[
                t_min, temp, press, hum, m_speed, c_force, f_rate, phase_encoded,
                temp_x_pressure, speed_x_force, humidity_temp_ratio, pressure_humidity
            ]])
        else:
            # Legacy artifacts were trained with a leaked feature (Flow_per_Power).
            # Keep compatibility by using a fixed nominal denominator, not user input.
            flow_per_power = f_rate / (NOMINAL_POWER_KW + 1e-9)
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
