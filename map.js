export function visualizeRoute(map, route) {
    // Clear existing layers
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    // Add markers for start and end points
    L.marker([route[0].lat, route[0].lng])
        .bindPopup('Start')
        .addTo(map);
    
    L.marker([route[route.length-1].lat, route[route.length-1].lng])
        .bindPopup('End')
        .addTo(map);

    // Draw route line
    const routeCoords = route.map(point => [point.lat, point.lng]);
    L.polyline(routeCoords, {
        color: 'blue',
        weight: 3,
        opacity: 0.7
    }).addTo(map);

    // Fit map bounds to show entire route
    map.fitBounds(routeCoords);
}