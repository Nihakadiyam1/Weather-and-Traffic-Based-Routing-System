import datetime
from typing import Dict, Tuple
from models.xgboost_predictor import TravelTimePredictor
from optimization.genetic_algorithm import RouteOptimizer
from visualization.route_plotter import plot_route

def optimize_route(locations: Dict[str, Tuple[float, float]], 
                  date: datetime.date,
                  generations: int = 100,
                  visualize: bool = True) -> Dict:
    """
    Optimize delivery route
    Args:
        locations: Dictionary of location IDs to (lat, lon) coordinates
        date: Date of travel
        generations: Number of generations for genetic algorithm
        visualize: Whether to create visualization
    Returns:
        Dictionary containing best route, total time and fitness history
    """
    predictor = TravelTimePredictor()
    optimizer = RouteOptimizer(predictor, locations, date)
    
    fitness_history, best_route = optimizer.evolve(generations=generations)
    
    result = {
        'best_route': best_route,
        'total_time': optimizer.fitness_score(best_route),
        'fitness_history': fitness_history
    }
    
    if visualize:
        map_obj = plot_route(locations, best_route, 'route_map.html')
        result['map'] = map_obj
        
    return result

if __name__ == "__main__":
    # Sample usage
    test_locations = {
        'L1': (40.819688, -73.915091),
        'L2': (40.815421, -73.941761),
        'L3': (40.764198, -73.910785),
        'L4': (40.768790, -73.953285),
        'L5': (40.734851, -73.952950)
    }
    
    date = datetime.date(2016, 4, 6)
    result = optimize_route(test_locations, date)
    
    print(f"Best route: {' -> '.join(result['best_route'])}")
    print(f"Total estimated time: {result['total_time']:.2f} minutes")