# IITH Hackathon Project

Full-stack manufacturing prediction dashboard with:
- Flask backend for ML inference
- React + Vite frontend for interactive input and visualization

## Project Structure

```text
backend/
frontend/
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Backend Setup (Flask)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs on `http://127.0.0.1:5000`.

### Important Model Files

The backend expects these artifact files inside `backend/`:
- `model.pkl` (or `track_a_rf_model.pkl`)
- `scaler.pkl`
- `pca.pkl`
- `label_encoder.pkl`
- `imputer.pkl`

Leakage-free artifact set (preferred when present):
- `track_a_rf_model_clean.pkl`
- `scaler_clean.pkl`
- `pca_clean.pkl`
- `label_encoder_clean.pkl`

Note: `backend/model.pkl` is intentionally git-ignored because it can exceed GitHub file size limits.

## Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend typically runs on `http://localhost:5173`.

## API Endpoints

- `GET /health` -> service health check
- `POST /predict` -> prediction endpoint

Example request body for `/predict`:

```json
{
  "time_minutes": 120,
  "temperature": 60,
  "pressure": 1.0,
  "humidity": 45,
  "motor_speed": 150,
  "compression_force": 30,
  "flow_rate": 60,
  "phase": "Compression"
}
```

## Retrain Leakage-Free Artifacts

The original notebook-derived pipeline included `Flow_per_Power`, which depends on
`Power_Consumption_kW` (a target). The clean retraining script removes that leakage.

```bash
cd backend
pip install pandas
python retrain_clean_model.py --csv batch_process_data.csv --out-dir .
```

After the 4 `*_clean.pkl` files are generated, `backend/app.py` will automatically
use them for inference.

## Development Notes

- Start backend first, then frontend.
- If frontend and backend run on different ports, CORS is already enabled in Flask.
