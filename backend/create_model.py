"""
Generate a dummy ML model for manufacturing batch prediction.
Produces model.pkl that predicts energy, yield, quality, and performance.
"""
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib

np.random.seed(42)

# Generate synthetic training data
n_samples = 500

batch_size = np.random.uniform(50, 500, n_samples)
temperature = np.random.uniform(150, 350, n_samples)
hold_time = np.random.uniform(5, 60, n_samples)
machine_speed = np.random.uniform(20, 100, n_samples)
material_type = np.random.choice([0, 1, 2], n_samples)  # A=0, B=1, C=2

X = np.column_stack([batch_size, temperature, hold_time, machine_speed, material_type])

# Synthetic target formulas (with noise)
energy = (
    batch_size * 2.5
    + temperature * 1.8
    + hold_time * 3.0
    + machine_speed * 0.5
    + material_type * 50
    + np.random.normal(0, 30, n_samples)
)

yield_val = (
    batch_size * 0.9
    - temperature * 0.05
    + hold_time * 0.3
    + machine_speed * 0.2
    + material_type * 10
    + np.random.normal(0, 10, n_samples)
)

quality = np.clip(
    85
    + (temperature - 250) * 0.02
    - (machine_speed - 60) * 0.05
    + hold_time * 0.1
    - material_type * 2
    + np.random.normal(0, 3, n_samples),
    50, 100
)

performance = np.clip(
    90
    - abs(temperature - 250) * 0.03
    + (machine_speed - 50) * 0.04
    - hold_time * 0.02
    + material_type * 1.5
    + np.random.normal(0, 2, n_samples),
    50, 100
)

Y = np.column_stack([energy, yield_val, quality, performance])

# Build and train the model
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42)))
])

pipeline.fit(X, Y)

joblib.dump(pipeline, "model.pkl")
print("✅ model.pkl created successfully!")
print(f"   Training samples: {n_samples}")
print(f"   Features: [batch_size, temperature, hold_time, machine_speed, material_type]")
print(f"   Targets:  [energy, yield, quality, performance]")
