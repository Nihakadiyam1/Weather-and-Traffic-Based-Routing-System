from flask import Flask, request, jsonify, render_template
import datetime
from main import optimize_route

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.json
    locations = {}
    
    # Parse locations from request
    for loc in data['locations']:
        locations[loc['id']] = (float(loc['lat']), float(loc['lng']))
    
    # Parse date
    date_parts = [int(x) for x in data['date'].split('-')]
    date = datetime.date(date_parts[0], date_parts[1], date_parts[2])
    
    # Run optimization
    result = optimize_route(
        locations=locations,
        date=date,
        generations=int(data.get('generations', 100)),
        visualize=True
    )
    
    return jsonify({
        'route': result['best_route'],
        'total_time': result['total_time'],
        'map_url': '/static/route_map.html'
    })

if __name__ == '__main__':
    app.run(debug=True)