class SortingVisualizer {
  constructor() {
    this.array = [];
    this.arraySize = 50;
    this.delay = 50;
    this.isRunning = false;

    // Referencias DOM
    this.visualizationArea = document.querySelector(".visualization-area");
    this.sizeSlider = document.querySelector("#arraySize");
    this.speedSlider = document.querySelector("#sortingSpeed");
    this.algorithmSelect = document.querySelector("#algorithm");
    this.startButton = document.querySelector("#startSort");
    this.resetButton = document.querySelector("#resetArray");

    // Stats
    this.comparisons = 0;
    this.swaps = 0;
    this.timeStart = 0;

    // K-means
    this.kMeansPoints = [];
    this.centroids = [];

    // Inicialización
    this.initializeEventListeners();
    this.generateNewArray();
  }

  initializeEventListeners() {
    this.sizeSlider.addEventListener("input", () => {
      this.arraySize = parseInt(this.sizeSlider.value);
      this.generateNewArray();
    });

    this.speedSlider.addEventListener("input", () => {
      this.delay = 100 - parseInt(this.speedSlider.value);
    });

    this.startButton.addEventListener("click", () => this.startSorting());
    this.resetButton.addEventListener("click", () => this.generateNewArray());

    this.algorithmSelect.addEventListener("change", () => {
      this.generateNewArray();

      // Actualizar visibilidad de controles
      if (this.algorithmSelect.value === "kmeans") {
        this.sizeSlider.parentElement.style.display = "none";
      } else {
        this.sizeSlider.parentElement.style.display = "flex";
      }
    });
  }

  generateNewArray() {
    if (this.algorithmSelect.value === "kmeans") {
      this.generateRandomPoints(50);
      this.initializeCentroids(3);
      this.renderKMeans([[]]);
    } else {
      this.array = Array.from(
        { length: this.arraySize },
        () => Math.floor(Math.random() * 100) + 1
      );
      this.renderArray();
    }
    this.resetStats();
  }

  renderArray(comparingIndices = []) {
    this.visualizationArea.innerHTML = "";
    this.visualizationArea.className = "visualization-area";

    // Si estamos en modo K-means, no renderizar barras
    if (this.algorithmSelect.value === "kmeans") {
      this.visualizationArea.classList.add("kmeans-mode");
      return;
    }

    // Modo de ordenamiento normal
    const maxVal = Math.max(...this.array);

    this.array.forEach((value, idx) => {
      const bar = document.createElement("div");
      bar.className = "array-bar";
      bar.style.height = `${(value / maxVal) * 100}%`;

      if (comparingIndices.includes(idx)) {
        bar.classList.add("comparing");
      }

      this.visualizationArea.appendChild(bar);
    });
  }

  async startSorting() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Deshabilitar controles durante la ejecución
    this.startButton.disabled = true;
    this.algorithmSelect.disabled = true;
    this.sizeSlider.disabled = true;
    this.speedSlider.disabled = true;

    this.timeStart = performance.now();

    switch (this.algorithmSelect.value) {
      case "bubble":
        await this.bubbleSort();
        break;
      case "selection":
        await this.selectionSort();
        break;
      case "insertion":
        await this.insertionSort();
        break;
      case "quick":
        await this.quickSort(0, this.array.length - 1);
        break;
      case "merge":
        await this.mergeSort(0, this.array.length - 1);
        break;
      case "heap":
        await this.heapSort();
        break;
      case "shell":
        await this.shellSort();
        break;
      case "cocktail":
        await this.cocktailSort();
        break;
      case "comb":
        await this.combSort();
        break;
      case "gnome":
        await this.gnomeSort();
        break;
      case "kmeans":
        await this.kMeansClustering();
        break;
    }

    this.isRunning = false;

    // Rehabilitar controles
    this.startButton.disabled = false;
    this.algorithmSelect.disabled = false;
    this.sizeSlider.disabled = false;
    this.speedSlider.disabled = false;

    this.updateStats();
  }

  async bubbleSort() {
    for (let i = 0; i < this.array.length; i++) {
      for (let j = 0; j < this.array.length - i - 1; j++) {
        this.comparisons++;
        if (this.array[j] > this.array[j + 1]) {
          await this.swap(j, j + 1);
        }
        this.renderArray([j, j + 1]);
        await this.sleep();
      }
    }
    this.renderArray();
  }

  async selectionSort() {
    for (let i = 0; i < this.array.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < this.array.length; j++) {
        this.comparisons++;
        if (this.array[j] < this.array[minIdx]) {
          minIdx = j;
        }
        this.renderArray([i, j, minIdx]);
        await this.sleep();
      }
      if (minIdx !== i) {
        await this.swap(i, minIdx);
      }
    }
    this.renderArray();
  }

  async insertionSort() {
    for (let i = 1; i < this.array.length; i++) {
      let key = this.array[i];
      let j = i - 1;
      this.renderArray([i, j]);
      await this.sleep();

      while (j >= 0 && this.array[j] > key) {
        this.comparisons++;
        this.array[j + 1] = this.array[j];
        j--;
        this.renderArray([i, j + 1]);
        await this.sleep();
      }
      this.array[j + 1] = key;
      this.swaps++;
    }
    this.renderArray();
  }

  async quickSort(low, high) {
    if (low < high) {
      let pi = await this.partition(low, high);
      await this.quickSort(low, pi - 1);
      await this.quickSort(pi + 1, high);
    }
  }

  async partition(low, high) {
    let pivot = this.array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.comparisons++;
      if (this.array[j] < pivot) {
        i++;
        await this.swap(i, j);
      }
      this.renderArray([high, i, j]);
      await this.sleep();
    }
    await this.swap(i + 1, high);
    return i + 1;
  }

  async mergeSort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await this.mergeSort(left, mid);
      await this.mergeSort(mid + 1, right);
      await this.merge(left, mid, right);
    }
  }

  async merge(left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = this.array[left + i];
    for (let j = 0; j < n2; j++) R[j] = this.array[mid + 1 + j];

    let i = 0,
      j = 0,
      k = left;

    while (i < n1 && j < n2) {
      this.comparisons++;
      if (L[i] <= R[j]) {
        this.array[k] = L[i];
        i++;
      } else {
        this.array[k] = R[j];
        j++;
      }
      this.swaps++;
      this.renderArray([k]);
      await this.sleep();
      k++;
    }

    while (i < n1) {
      this.array[k] = L[i];
      this.swaps++;
      this.renderArray([k]);
      await this.sleep();
      i++;
      k++;
    }

    while (j < n2) {
      this.array[k] = R[j];
      this.swaps++;
      this.renderArray([k]);
      await this.sleep();
      j++;
      k++;
    }
  }

  async heapSort() {
    for (let i = Math.floor(this.array.length / 2) - 1; i >= 0; i--)
      await this.heapify(this.array.length, i);

    for (let i = this.array.length - 1; i > 0; i--) {
      await this.swap(0, i);
      await this.heapify(i, 0);
    }
  }

  async heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    this.comparisons++;
    if (left < n && this.array[left] > this.array[largest]) largest = left;

    this.comparisons++;
    if (right < n && this.array[right] > this.array[largest]) largest = right;

    if (largest !== i) {
      await this.swap(i, largest);
      await this.heapify(n, largest);
    }
    this.renderArray([i, largest]);
    await this.sleep();
  }

  async shellSort() {
    for (
      let gap = Math.floor(this.array.length / 2);
      gap > 0;
      gap = Math.floor(gap / 2)
    ) {
      for (let i = gap; i < this.array.length; i++) {
        let temp = this.array[i];
        let j;
        for (j = i; j >= gap && this.array[j - gap] > temp; j -= gap) {
          this.comparisons++;
          this.array[j] = this.array[j - gap];
          this.swaps++;
          this.renderArray([j, j - gap]);
          await this.sleep();
        }
        this.array[j] = temp;
      }
    }
    this.renderArray();
  }

  async cocktailSort() {
    let start = 0;
    let end = this.array.length - 1;
    let swapped = true;

    while (swapped) {
      swapped = false;
      for (let i = start; i < end; i++) {
        this.comparisons++;
        if (this.array[i] > this.array[i + 1]) {
          await this.swap(i, i + 1);
          swapped = true;
        }
        this.renderArray([i, i + 1]);
        await this.sleep();
      }
      if (!swapped) break;
      swapped = false;
      end--;

      for (let i = end - 1; i >= start; i--) {
        this.comparisons++;
        if (this.array[i] > this.array[i + 1]) {
          await this.swap(i, i + 1);
          swapped = true;
        }
        this.renderArray([i, i + 1]);
        await this.sleep();
      }
      start++;
    }
    this.renderArray();
  }

  async combSort() {
    let gap = this.array.length;
    let shrink = 1.3;
    let sorted = false;

    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }

      for (let i = 0; i + gap < this.array.length; i++) {
        this.comparisons++;
        if (this.array[i] > this.array[i + gap]) {
          await this.swap(i, i + gap);
          sorted = false;
        }
        this.renderArray([i, i + gap]);
        await this.sleep();
      }
    }
    this.renderArray();
  }

  async gnomeSort() {
    let index = 0;
    while (index < this.array.length) {
      if (index === 0) {
        index++;
      }
      this.comparisons++;
      if (this.array[index] >= this.array[index - 1]) {
        index++;
      } else {
        await this.swap(index, index - 1);
        index--;
      }
      this.renderArray([index, index - 1]);
      await this.sleep();
    }
    this.renderArray();
  }

  async swap(i, j) {
    this.swaps++;
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
  }

  sleep() {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  resetStats() {
    this.comparisons = 0;
    this.swaps = 0;
    this.timeStart = 0;
    this.updateStats();
  }

  updateStats() {
    const timeElapsed = this.timeStart ? performance.now() - this.timeStart : 0;
    document.querySelector("#comparisons").textContent = this.comparisons;
    document.querySelector("#swaps").textContent = this.swaps;
    document.querySelector("#time").textContent = `${timeElapsed.toFixed(2)}ms`;
  }

  // K-means Clustering Algorithm
  async kMeansClustering(k = 3, iterations = 10) {
    // Generar puntos aleatorios en 2D
    this.generateRandomPoints(50);

    // Inicializar centroides aleatoriamente
    this.initializeCentroids(k);

    for (let iter = 0; iter < iterations; iter++) {
      // Asignar puntos a clusters
      const clusters = new Array(k).fill().map(() => []);

      for (let point of this.kMeansPoints) {
        const closestCentroid = this.findClosestCentroid(point);
        clusters[closestCentroid].push(point);
        this.comparisons++;
      }

      // Actualizar centroides
      let changed = false;
      for (let i = 0; i < k; i++) {
        if (clusters[i].length > 0) {
          const newCentroid = this.calculateNewCentroid(clusters[i]);
          if (!this.arePointsEqual(this.centroids[i], newCentroid)) {
            this.centroids[i] = newCentroid;
            changed = true;
          }
        }
      }

      // Visualizar el estado actual
      await this.renderKMeans(clusters);
      await this.sleep();

      // Si los centroides no cambiaron, terminar
      if (!changed) break;
    }
  }

  generateRandomPoints(n) {
    this.kMeansPoints = [];
    for (let i = 0; i < n; i++) {
      this.kMeansPoints.push({
        x: Math.random() * this.visualizationArea.clientWidth,
        y: Math.random() * this.visualizationArea.clientHeight,
      });
    }
  }

  initializeCentroids(k) {
    this.centroids = [];
    for (let i = 0; i < k; i++) {
      this.centroids.push({
        x: Math.random() * this.visualizationArea.clientWidth,
        y: Math.random() * this.visualizationArea.clientHeight,
      });
    }
  }

  findClosestCentroid(point) {
    let minDist = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < this.centroids.length; i++) {
      const dist = this.euclideanDistance(point, this.centroids[i]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    return closestIndex;
  }

  euclideanDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  calculateNewCentroid(points) {
    const sum = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );
    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  }

  arePointsEqual(p1, p2) {
    return Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001;
  }

  async renderKMeans(clusters) {
    this.visualizationArea.innerHTML = "";

    // Colores para los diferentes clusters
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

    // Dibujar puntos
    clusters.forEach((cluster, i) => {
      cluster.forEach((point) => {
        const dot = document.createElement("div");
        dot.className = "data-point";
        dot.style.left = `${point.x}px`;
        dot.style.top = `${point.y}px`;
        dot.style.backgroundColor = colors[i % colors.length];
        this.visualizationArea.appendChild(dot);
      });
    });

    // Dibujar centroides
    this.centroids.forEach((centroid, i) => {
      const center = document.createElement("div");
      center.className = "centroid";
      center.style.left = `${centroid.x}px`;
      center.style.top = `${centroid.y}px`;
      center.style.borderColor = colors[i % colors.length];
      this.visualizationArea.appendChild(center);
    });
  }
}

// Inicializar el visualizador cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new SortingVisualizer();
});
