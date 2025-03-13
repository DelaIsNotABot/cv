class SortingVisualizer {
  constructor() {
    this.array = [];
    this.arraySize = 50;
    this.animationSpeed = 50;
    this.isAnimating = false;

    this.initializeModal();
    this.initializeControls();
    this.generateNewArray();
  }

  initializeModal() {
    // Crear el modal
    const modal = document.createElement("div");
    modal.className = "sorting-modal";
    modal.innerHTML = `
            <div class="sorting-container">
                <button class="close-modal">&times;</button>
                <h2>Sorting Algorithms Visualizer</h2>
                <div class="visualization-area"></div>
                <div class="sorting-controls">
                    <select id="algorithmSelect">
                        <option value="bubble">Bubble Sort</option>
                        <option value="quick">Quick Sort</option>
                        <option value="merge">Merge Sort</option>
                    </select>
                    <input type="range" id="sizeRange" min="10" max="100" value="50">
                    <input type="range" id="speedRange" min="1" max="100" value="50">
                    <button id="startSort">Start Sorting</button>
                    <button id="resetArray">Reset Array</button>
                </div>
            </div>
        `;
    document.body.appendChild(modal);
  }

  initializeControls() {
    // Event listeners para los controles
    document
      .getElementById("launchSortingViz")
      .addEventListener("click", () => {
        document.querySelector(".sorting-modal").style.display = "block";
      });

    document.querySelector(".close-modal").addEventListener("click", () => {
      document.querySelector(".sorting-modal").style.display = "none";
    });

    document
      .getElementById("algorithmSelect")
      .addEventListener("change", () => {
        if (!this.isAnimating) this.generateNewArray();
      });

    document.getElementById("sizeRange").addEventListener("input", (e) => {
      if (!this.isAnimating) {
        this.arraySize = parseInt(e.target.value);
        this.generateNewArray();
      }
    });

    document.getElementById("speedRange").addEventListener("input", (e) => {
      this.animationSpeed = 101 - parseInt(e.target.value);
    });

    document.getElementById("startSort").addEventListener("click", () => {
      if (!this.isAnimating) this.startSorting();
    });

    document.getElementById("resetArray").addEventListener("click", () => {
      if (!this.isAnimating) this.generateNewArray();
    });
  }

  generateNewArray() {
    this.array = Array(this.arraySize)
      .fill(0)
      .map(() => Math.random() * 300 + 5);
    this.updateVisualization();
  }

  updateVisualization() {
    const visualArea = document.querySelector(".visualization-area");
    visualArea.innerHTML = "";

    this.array.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "array-bar";
      bar.style.height = `${value}px`;
      visualArea.appendChild(bar);
    });
  }

  async startSorting() {
    this.isAnimating = true;
    const algorithm = document.getElementById("algorithmSelect").value;

    switch (algorithm) {
      case "bubble":
        await this.bubbleSort();
        break;
      case "quick":
        await this.quickSort(0, this.array.length - 1);
        break;
      case "merge":
        await this.mergeSort(0, this.array.length - 1);
        break;
    }

    this.isAnimating = false;
  }

  // Algoritmos de ordenación
  async bubbleSort() {
    const n = this.array.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (this.array[j] > this.array[j + 1]) {
          // Intercambiar elementos
          [this.array[j], this.array[j + 1]] = [
            this.array[j + 1],
            this.array[j],
          ];
          this.updateVisualization();
          await new Promise((resolve) =>
            setTimeout(resolve, this.animationSpeed)
          );
        }
      }
    }
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
      if (this.array[j] < pivot) {
        i++;
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        this.updateVisualization();
        await new Promise((resolve) =>
          setTimeout(resolve, this.animationSpeed)
        );
      }
    }

    [this.array[i + 1], this.array[high]] = [
      this.array[high],
      this.array[i + 1],
    ];
    this.updateVisualization();
    await new Promise((resolve) => setTimeout(resolve, this.animationSpeed));

    return i + 1;
  }

  async mergeSort(l, r) {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      await this.mergeSort(l, m);
      await this.mergeSort(m + 1, r);
      await this.merge(l, m, r);
    }
  }

  async merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = Array(n1);
    const R = Array(n2);

    for (let i = 0; i < n1; i++) L[i] = this.array[l + i];
    for (let j = 0; j < n2; j++) R[j] = this.array[m + 1 + j];

    let i = 0,
      j = 0,
      k = l;

    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        this.array[k] = L[i];
        i++;
      } else {
        this.array[k] = R[j];
        j++;
      }
      this.updateVisualization();
      await new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
      k++;
    }

    while (i < n1) {
      this.array[k] = L[i];
      this.updateVisualization();
      await new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
      i++;
      k++;
    }

    while (j < n2) {
      this.array[k] = R[j];
      this.updateVisualization();
      await new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
      j++;
      k++;
    }
  }
}

// Inicializar el visualizador
document.addEventListener("DOMContentLoaded", () => {
  const visualizer = new SortingVisualizer();
});
