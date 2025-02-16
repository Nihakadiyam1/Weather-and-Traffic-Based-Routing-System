import numpy as np
import pandas as pd
import xgboost as xgb
import pickle
from typing import Tuple
from ..utils.distance import haversine_distance

class TravelTimePredictor:
    def __init__(self, model_path: str = "xgb_model.sav"):
        self.model = self._load_model(model_path)
    
    def _load_model(self, model_path: str):
        """Load the saved XGBoost model"""
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    
    def predict_travel_time(self, point1: Tuple[float, float], 
                          point2: Tuple[float, float], 
                          date, hour: int = 11, 
                          passenger_count: int = 1) -> float:
        """Predict travel time between two points"""
        features = self._prepare_features(point1, point2, date, hour, passenger_count)
        pred = np.exp(self.model.predict(xgb.DMatrix(features))) - 1
        return pred[0]
    
    def _prepare_features(self, point1: Tuple[float, float], 
                         point2: Tuple[float, float], 
                         date, hour: int, 
                         passenger_count: int) -> pd.DataFrame:
        """Prepare feature DataFrame for prediction"""
        return pd.DataFrame([{
            'passenger_count': passenger_count,
            'pickup_longitude': point1[1],
            'pickup_latitude': point1[0],
            'dropoff_longitude': point2[1],
            'dropoff_latitude': point2[0],
            'store_and_fwd_flag': 0,
            'pickup_month': date.month,
            'pickup_day': date.day,
            'pickup_weekday': date.weekday(),
            'pickup_hour': hour,
            'pickup_minute': 0,
            'latitude_difference': point2[0] - point1[0],
            'longitude_difference': point2[1] - point1[1],
            'trip_distance': haversine_distance(point1, point2)
        }])