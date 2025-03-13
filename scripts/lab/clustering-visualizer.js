class ClusteringVisualizer {
  constructor() {
    this.canvas = document.getElementById("clusteringCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.points = [];
    this.clusters = [];
    this.isRunning = false;
    this.algorithm = "kmeans";
    this.k = 3;
    this.numPoints = 50;
    
    this.initializeControls();
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  initializeControls() {
    this.algorithmSelect = document.getElementById("clusteringAlgorithm");
    this.numClustersInput = document.getElementById("numClusters");
    this.numPointsInput = document.getElementById("numPoints");
    this.generateBtn = document.getElementById("generateData");
    this.startBtn = document.getElementById("startClustering");

    this.generateBtn.addEventListener("click", () => this.generatePoints());
    this.startBtn.addEventListener("click", () => this.startClustering());
    this.algorithmSelect.addEventListener("change", () => this.updateAlgorithm());
    
    // Sliders con valores en tiempo real
    this.numClustersInput.addEventListener("input", (e) => {
      e.target.nextElementSibling.textContent = e.target.value;
      this.k = parseInt(e.target.value);
    });

    this.numPointsInput.addEventListener("input", (e) => {
      e.target.nextElementSibling.textContent = e.target.value;
      this.numPoints = parseInt(e.target.value);
    });
  }

  resizeCanvas() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.render();
  }

  generatePoints() {
    this.points = Array.from({ length: this.numPoints }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      cluster: null
    }));
    this.render();
  }

  async startClustering() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startBtn.disabled = true;

    switch (this.algorithm) {
      case "kmeans":
        await this.kMeans();
        break;
      case "dbscan":
        await this.dbscan();
        break;
      case "hierarchical":
        await this.hierarchicalClustering();
        break;
    }

    this.isRunning = false;
    this.startBtn.disabled = false;
  }

  // Algoritmos de clustering
  async kMeans() {
    // Inicializar centroides
    let centroids = Array.from({ length: this.k }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height
    }));

    let changed = true;
    let iterations = 0;
    const maxIterations = 50;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      // Asignar puntos a clusters
      for (let point of this.points) {
        const oldCluster = point.cluster;
        point.cluster = this.findNearestCentroid(point, centroids);
        if (oldCluster !== point.cluster) changed = true;
      }

      // Actualizar centroides
      for (let i = 0; i < this.k; i++) {
        const clusterPoints = this.points.filter(p => p.cluster === i);
        if (clusterPoints.length > 0) {
          centroids[i] = this.calculateCentroid(clusterPoints);
        }
      }

      this.render(centroids);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Métodos auxiliares
  findNearestCentroid(point, centroids) {
    let minDist = Infinity;
    let cluster = 0;
    
    centroids.forEach((centroid, i) => {
      const dist = this.distance(point, centroid);
      if (dist < minDist) {
        minDist = dist;
        cluster = i;
      }
    });
    
    return cluster;
  }

  distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  calculateCentroid(points) {
    const sum = points.reduce((acc, p) => ({
      x: acc.x + p.x,
      y: acc.y + p.y
    }), { x: 0, y: 0 });
    
    return {
      x: sum.x / points.length,
      y: sum.y / points.length
    };
  }

  render(centroids = []) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Dibujar puntos
    this.points.forEach(point => {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      this.ctx.fillStyle = point.cluster !== null ? 
        this.getClusterColor(point.cluster) : '#fff';
      this.ctx.fill();
    });

    // Dibujar centroides
    centroids.forEach((centroid, i) => {
      this.ctx.beginPath();
      this.ctx.arc(centroid.x, centroid.y, 8, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.getClusterColor(i);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }

  getClusterColor(index) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#95E1D3', '#88D8B0', 
      '#FFE66D', '#FF8B94', '#A8E6CF', '#DCEDC1'
    ];
    return colors[index % colors.length];
  }
} 