# Route Optimizer with Machine Learning

This project optimizes travel routes using machine learning predictions and genetic algorithms.

## Project Structure

```
src/
├── models/
│   └── xgboost_predictor.py    # ML model wrapper
├── optimization/
│   └── genetic_algorithm.py    # Route optimization logic
└── main.py                     # Main entry point

```

## Features

- Travel time prediction using XGBoost
- Route optimization using genetic algorithms
- Modular and maintainable code structure
- Type hints for better code clarity

## Usage

```python
from src.main import optimize_route
import datetime

# Define locations
locations = {
    'L1': (40.819688, -73.915091),
    'L2': (40.815421, -73.941761)
}

# Set date
date = datetime.date(2016, 4, 6)

# Optimize route
result = optimize_route(locations, date)
print(f"Best route: {' -> '.join(result['best_route'])}")
```

## Requirements

See requirements.txt for dependencies.