export class AStar {
  constructor(graph) {
    this.graph = graph;
  }

  heuristic(node, goal) {
    // Manhattan distance heuristic
    return Math.abs(node.lat - goal.lat) + Math.abs(node.lng - goal.lng);
  }

  findPath(start, goal) {
    const openSet = new Set([this.graph.getNodeKey(start)]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    const startKey = this.graph.getNodeKey(start);
    gScore.set(startKey, 0);
    fScore.set(startKey, this.heuristic(start, goal));

    while (openSet.size > 0) {
      const currentKey = this.getLowestFScore(openSet, fScore);
      const current = this.graph.nodeKeys.get(currentKey);
      
      if (this.graph.getNodeKey(current) === this.graph.getNodeKey(goal)) {
        return this.reconstructPath(cameFrom, currentKey);
      }

      openSet.delete(currentKey);
      
      for (let neighbor of this.graph.getNeighbors(current)) {
        const neighborKey = this.graph.getNodeKey(neighbor);
        const tentativeGScore = gScore.get(currentKey) + 
          this.graph.distance(current, neighbor);
        
        if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
          cameFrom.set(neighborKey, currentKey);
          gScore.set(neighborKey, tentativeGScore);
          fScore.set(neighborKey, gScore.get(neighborKey) + 
            this.heuristic(neighbor, goal));
          
          if (!openSet.has(neighborKey)) {
            openSet.add(neighborKey);
          }
        }
      }
    }

    return null;
  }

  getLowestFScore(openSet, fScore) {
    return Array.from(openSet).reduce((lowest, key) => 
      !lowest || fScore.get(key) < fScore.get(lowest) ? key : lowest
    );
  }

  reconstructPath(cameFrom, currentKey) {
    const path = [this.graph.nodeKeys.get(currentKey)];
    let current = currentKey;
    
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(this.graph.nodeKeys.get(current));
    }
    return path;
  }
}