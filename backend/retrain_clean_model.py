"""
Retrain a leakage-free Track A model.

This script removes target leakage by excluding Flow_per_Power from features.
It saves a clean artifact set used automatically by backend/app.py.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler


RAW_TO_CLEAN_COLS = [
    "Batch_ID",
    "Time_Minutes",
    "Phase",
    "Temperature_C",
    "Pressure_Bar",
    "Humidity_Percent",
    "Motor_Speed_RPM",
    "Compression_Force_kN",
    "Flow_Rate_LPM",
    "Power_Consumption_kW",
    "Vibration_mm_s",
]

TARGET_COLS = ["Power_Consumption_kW", "Vibration_mm_s"]

# Leakage-free feature list: Flow_per_Power is intentionally removed.
FEATURE_COLS = [
    "Time_Minutes",
    "Temperature_C",
    "Pressure_Bar",
    "Humidity_Percent",
    "Motor_Speed_RPM",
    "Compression_Force_kN",
    "Flow_Rate_LPM",
    "Phase_encoded",
    "Temp_x_Pressure",
    "Speed_x_Force",
    "Humidity_Temp_ratio",
    "Pressure_Humidity",
]


def load_and_prepare(csv_path: Path) -> tuple[pd.DataFrame, LabelEncoder]:
    df = pd.read_csv(csv_path)

    if len(df.columns) >= len(RAW_TO_CLEAN_COLS):
        df = df.iloc[:, : len(RAW_TO_CLEAN_COLS)].copy()
        df.columns = RAW_TO_CLEAN_COLS

    required = set(RAW_TO_CLEAN_COLS)
    missing = required.difference(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    # Drop malformed rows (for example, accidental duplicate header rows in data).
    df["Phase"] = df["Phase"].astype(str).str.strip()
    df = df[df["Phase"].str.len() > 0].copy()
    df = df[df["Phase"].str.lower() != "phase"].copy()

    numeric_cols = [
        "Time_Minutes",
        "Temperature_C",
        "Pressure_Bar",
        "Humidity_Percent",
        "Motor_Speed_RPM",
        "Compression_Force_kN",
        "Flow_Rate_LPM",
        "Power_Consumption_kW",
        "Vibration_mm_s",
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    imputer = SimpleImputer(strategy="median")
    df[numeric_cols] = imputer.fit_transform(df[numeric_cols])

    le = LabelEncoder()
    df["Phase_encoded"] = le.fit_transform(df["Phase"].astype(str))

    df["Temp_x_Pressure"] = df["Temperature_C"] * df["Pressure_Bar"]
    df["Speed_x_Force"] = df["Motor_Speed_RPM"] * df["Compression_Force_kN"]
    df["Humidity_Temp_ratio"] = df["Humidity_Percent"] / (df["Temperature_C"] + 1e-9)
    df["Pressure_Humidity"] = df["Pressure_Bar"] * df["Humidity_Percent"]

    return df, le


def train_model(df: pd.DataFrame, random_state: int) -> tuple[MultiOutputRegressor, StandardScaler, PCA, float]:
    X = df[FEATURE_COLS].values
    y = df[TARGET_COLS].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    pca = PCA(n_components=0.95, random_state=random_state)
    X_pca = pca.fit_transform(X_scaled)

    X_train, X_test, y_train, y_test = train_test_split(
        X_pca, y, test_size=0.2, random_state=random_state
    )

    model = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=300, random_state=random_state, n_jobs=-1)
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    return model, scaler, pca, float(r2)


def save_artifacts(out_dir: Path, model, scaler, pca, le) -> None:
    joblib.dump(model, out_dir / "track_a_rf_model_clean.pkl")
    joblib.dump(scaler, out_dir / "scaler_clean.pkl")
    joblib.dump(pca, out_dir / "pca_clean.pkl")
    joblib.dump(le, out_dir / "label_encoder_clean.pkl")



def main() -> None:
    parser = argparse.ArgumentParser(description="Retrain leakage-free model artifacts")
    parser.add_argument(
        "--csv",
        default="batch_process_data.csv",
        help="Path to training CSV (default: batch_process_data.csv)",
    )
    parser.add_argument(
        "--out-dir",
        default=".",
        help="Directory where clean artifacts are written (default: current dir)",
    )
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()

    csv_path = Path(args.csv).resolve()
    out_dir = Path(args.out_dir).resolve()

    if not csv_path.exists():
        raise FileNotFoundError(
            f"Training CSV not found: {csv_path}. Place batch_process_data.csv in backend/ or pass --csv."
        )

    out_dir.mkdir(parents=True, exist_ok=True)

    df, le = load_and_prepare(csv_path)
    model, scaler, pca, r2 = train_model(df, args.seed)
    save_artifacts(out_dir, model, scaler, pca, le)

    print("Saved leakage-free artifacts:")
    print("- track_a_rf_model_clean.pkl")
    print("- scaler_clean.pkl")
    print("- pca_clean.pkl")
    print("- label_encoder_clean.pkl")
    print(f"Rows used: {len(df)}")
    print(f"Features used ({len(FEATURE_COLS)}): {FEATURE_COLS}")
    print(f"Targets: {TARGET_COLS}")
    print(f"Validation R2 (overall): {r2:.4f}")


if __name__ == "__main__":
    main()
