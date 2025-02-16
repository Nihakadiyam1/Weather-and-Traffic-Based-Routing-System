export class Dijkstra {
  constructor(graph) {
    this.graph = graph;
  }

  findPath(start, goal) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();

    // Initialize distances
    for (let nodeKey of this.graph.nodes) {
      distances.set(nodeKey, Infinity);
      unvisited.add(nodeKey);
    }
    
    const startKey = this.graph.getNodeKey(start);
    distances.set(startKey, 0);

    while (unvisited.size > 0) {
      const currentKey = this.getClosestNode(unvisited, distances);
      const current = this.graph.nodeKeys.get(currentKey);
      
      if (this.graph.getNodeKey(current) === this.graph.getNodeKey(goal)) {
        return this.reconstructPath(previous, currentKey);
      }

      unvisited.delete(currentKey);

      for (let neighbor of this.graph.getNeighbors(current)) {
        const neighborKey = this.graph.getNodeKey(neighbor);
        if (!unvisited.has(neighborKey)) continue;
        
        const distance = distances.get(currentKey) + 
          this.graph.distance(current, neighbor);
        
        if (distance < distances.get(neighborKey)) {
          distances.set(neighborKey, distance);
          previous.set(neighborKey, currentKey);
        }
      }
    }

    return null;
  }

  getClosestNode(nodes, distances) {
    return Array.from(nodes).reduce((closest, key) => 
      !closest || distances.get(key) < distances.get(closest) ? key : closest
    );
  }

  reconstructPath(previous, currentKey) {
    const path = [this.graph.nodeKeys.get(currentKey)];
    let current = currentKey;
    
    while (previous.has(current)) {
      current = previous.get(current);
      path.unshift(this.graph.nodeKeys.get(current));
    }
    return path;
  }
}