import joblib

try:
    model = joblib.load("model.pkl")
    print(f"Model type: {type(model)}")
    if hasattr(model, 'estimators_'):
        print("This is a MultiOutputRegressor")
        print(f"Number of estimators: {len(model.estimators_)}")
        print(f"First estimator type: {type(model.estimators_[0])}")
        print(f"Expected features (n_features_in_): {model.estimators_[0].n_features_in_}")
    elif hasattr(model, 'n_features_in_'):
        print(f"Expected features (n_features_in_): {model.n_features_in_}")
        if hasattr(model, 'feature_names_in_'):
             print(f"Feature names: {model.feature_names_in_}")
except Exception as e:
    print(f"Error: {e}")
