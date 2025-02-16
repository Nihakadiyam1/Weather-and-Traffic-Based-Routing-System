"""Utilities for calculating distances between coordinates"""
import numpy as np
from typing import Tuple

def haversine_distance(point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
    """
    Calculate distance between two points using Haversine formula
    Args:
        point1: (latitude, longitude) of first point
        point2: (latitude, longitude) of second point
    Returns:
        Distance in miles
    """
    EARTH_RADIUS_KM = 6371
    KM_TO_MILES = 0.621371
    
    lat1, lon1 = point1
    lat2, lon2 = point2
    
    lat_diff = abs(lat2 - lat1) * np.pi / 180
    lon_diff = abs(lon2 - lon1) * np.pi / 180
    
    lat_term = np.arctan2(
        np.sqrt(np.square(np.sin(lat_diff / 2))),
        np.sqrt(1 - np.square(np.sin(lat_diff / 2)))
    )
    
    lon_term = np.arctan2(
        np.sqrt(np.square(np.sin(lon_diff / 2))),
        np.sqrt(1 - np.square(np.sin(lon_diff / 2)))
    )
    
    return KM_TO_MILES * EARTH_RADIUS_KM * (abs(2 * lat_term) + abs(2 * lon_term))