export function optimizeRoute(locations) {
    // Simplified optimizer for demo
    // In real app, this would call the Python backend
    const locationIds = Object.keys(locations);
    const route = [...locationIds, locationIds[0]]; // Return to start
    
    return {
        route: route,
        totalTime: 120 // Sample time in minutes
    };
}