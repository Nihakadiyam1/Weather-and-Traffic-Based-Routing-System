export class Graph {
  constructor() {
    this.nodes = new Set();
    this.edges = new Map();
    this.nodeKeys = new Map(); // Store string keys for nodes
  }

  // Generate unique key for a node
  getNodeKey(node) {
    return `${node.lat},${node.lng}`;
  }

  addNode(node) {
    const key = this.getNodeKey(node);
    this.nodes.add(key);
    this.nodeKeys.set(key, node);
    if (!this.edges.has(key)) {
      this.edges.set(key, []);
    }
  }

  addEdge(node1, node2) {
    const key1 = this.getNodeKey(node1);
    const key2 = this.getNodeKey(node2);
    
    if (!this.edges.has(key1) || !this.edges.has(key2)) {
      return; // Skip if either node doesn't exist
    }

    // Add bidirectional edges
    this.edges.get(key1).push(key2);
    this.edges.get(key2).push(key1);
  }

  getNeighbors(node) {
    const key = this.getNodeKey(node);
    if (!this.edges.has(key)) return [];
    
    // Convert keys back to nodes
    return this.edges.get(key)
      .map(neighborKey => this.nodeKeys.get(neighborKey));
  }

  distance(node1, node2) {
    return Math.sqrt(
      Math.pow(node1.lat - node2.lat, 2) + 
      Math.pow(node1.lng - node2.lng, 2)
    );
  }
}