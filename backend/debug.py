import joblib
import numpy as np
import sys
import traceback

with open("debug.log", "w") as f:
    try:
        model = joblib.load('model.pkl')
        scaler = joblib.load('scaler.pkl')
        pca = joblib.load('pca.pkl')
        le = joblib.load('label_encoder.pkl')
        imputer = joblib.load('imputer.pkl')

        f.write("--- Loaded artifacts ---\n")
        f.write(f"Model expecting: {getattr(model.estimators_[0], 'n_features_in_', 'unknown')}\n")
        f.write(f"Scaler expecting: {getattr(scaler, 'n_features_in_', 'unknown')}\n")
        f.write(f"PCA components: {pca.n_components_}\n")

        phase_encoded = float(le.transform(["Compression"])[0])
        t_min, temp, press, hum, m_speed, c_force, f_rate = 120, 60, 1.0, 45, 150, 30, 60

        temp_x_pressure = temp * press
        speed_x_force = m_speed * c_force
        humidity_temp_ratio = hum / (temp + 1e-9)
        flow_per_power = f_rate / (35.0 + 1e-9)
        pressure_humidity = press * hum

        X_new = np.array([[
            t_min, temp, press, hum, m_speed, c_force, f_rate, phase_encoded,
            temp_x_pressure, speed_x_force, humidity_temp_ratio, flow_per_power, pressure_humidity
        ]])
        f.write(f"Created X_new shape: {X_new.shape}\n")

        X_new_sc = scaler.transform(X_new)
        f.write(f"Scaled X_new_sc shape: {X_new_sc.shape}\n")

        X_new_pca = pca.transform(X_new_sc)
        f.write(f"PCA X_new_pca shape: {X_new_pca.shape}\n")

        preds = model.predict(X_new_pca)
        f.write(f"PREDS: {preds}\n")
    except Exception as e:
        traceback.print_exc(file=f)
