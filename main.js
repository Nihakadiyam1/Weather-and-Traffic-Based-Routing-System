import { AStar } from './utils/algorithms/astar.js';
import { Dijkstra } from './utils/algorithms/dijkstra.js';
import { Graph } from './utils/graph.js';
import { visualizeRoute } from './utils/map.js';

// Initialize map centered on user's location or world view
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Handle current location button
document.getElementById('use-current-location').addEventListener('click', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            document.getElementById('start-lat').value = lat;
            document.getElementById('start-lng').value = lng;
            
            // Update map view
            map.setView([lat, lng], 13);
        }, (error) => {
            alert("Error getting location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by your browser");
    }
});

// Handle location search
const searchInput = document.getElementById('location-search');
searchInput.addEventListener('input', debounce(async (e) => {
    const query = e.target.value;
    if (query.length < 3) return;
    
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const location = data[0];
            document.getElementById('end-lat').value = location.lat;
            document.getElementById('end-lng').value = location.lon;
        }
    } catch (error) {
        console.error('Error searching location:', error);
    }
}, 500));

// Handle form submission
document.getElementById('route-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const start = {
        lat: parseFloat(document.getElementById('start-lat').value),
        lng: parseFloat(document.getElementById('start-lng').value)
    };
    
    const end = {
        lat: parseFloat(document.getElementById('end-lat').value),
        lng: parseFloat(document.getElementById('end-lng').value)
    };
    
    const algorithm = document.getElementById('algorithm').value;
    
    // Create graph and add nodes
    const graph = new Graph();
    graph.addNode(start);
    graph.addNode(end);
    
    // Add intermediate nodes for better routing
    addIntermediateNodes(graph, start, end);
    
    // Find route using selected algorithm
    const route = findRoute(graph, start, end, algorithm);
    
    if (route) {
        // Visualize route on map
        visualizeRoute(map, route);
        
        // Display route information
        displayRouteInfo(route, algorithm);
    } else {
        document.getElementById('route-info').textContent = 'No route found';
    }
});

function addIntermediateNodes(graph, start, end) {
    // Calculate grid size based on distance
    const distance = getDistance(start, end);
    const gridSize = Math.max(5, Math.min(20, Math.floor(distance / 100)));
    
    const latStep = (end.lat - start.lat) / gridSize;
    const lngStep = (end.lng - start.lng) / gridSize;
    
    for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
            const node = {
                lat: start.lat + (latStep * i),
                lng: start.lng + (lngStep * j)
            };
            graph.addNode(node);
            
            // Connect to adjacent nodes
            if (i > 0) {
                const above = {
                    lat: start.lat + (latStep * (i-1)),
                    lng: start.lng + (lngStep * j)
                };
                graph.addEdge(node, above);
            }
            if (j > 0) {
                const left = {
                    lat: start.lat + (latStep * i),
                    lng: start.lng + (lngStep * (j-1))
                };
                graph.addEdge(node, left);
            }
        }
    }
}

function findRoute(graph, start, end, algorithm) {
    if (algorithm === 'astar') {
        const astar = new AStar(graph);
        return astar.findPath(start, end);
    } else {
        const dijkstra = new Dijkstra(graph);
        return dijkstra.findPath(start, end);
    }
}

function displayRouteInfo(route, algorithm) {
    const distance = calculateRouteDistance(route);
    
    document.getElementById('route-info').innerHTML = `
        <p><strong>Algorithm:</strong> ${algorithm === 'astar' ? 'A*' : 'Dijkstra'}</p>
        <p><strong>Number of points:</strong> ${route.length}</p>
    `;
    
    document.getElementById('distance-info').innerHTML = `
        <p><strong>Total distance:</strong> ${distance.toFixed(2)} km</p>
    `;
}

function calculateRouteDistance(route) {
    let distance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        distance += getDistance(route[i], route[i + 1]);
    }
    return distance;
}

function getDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(point2.lat - point1.lat);
    const dLng = deg2rad(point2.lng - point1.lng);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}