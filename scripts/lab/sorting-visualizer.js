class SortingVisualizer {
  constructor() {
    // Referencias DOM
    this.modal = document.querySelector(".modal");
    this.openBtn = document.querySelector(".interact-btn.open-visualizer");
    this.closeBtn = document.querySelector(".close-btn");
    this.container = document.querySelector(".visualization-area");
    this.infoContainer = document.querySelector(".algorithm-info");
    this.controls = {
      start: document.querySelector("#startSort"),
      reset: document.querySelector("#resetArray"),
      algorithm: document.querySelector("#algorithm"),
      size: document.querySelector("#arraySize"),
      speed: document.querySelector("#sortingSpeed"),
    };

    // Estado inicial
    this.array = [];
    this.isRunning = false;
    this.animationSpeed = 50;

    // Inicialización
    this.setupEventListeners();
    this.generateArray();

    this.algorithmInfo = {
      bubble: {
        name: "Bubble Sort",
        description:
          "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed.",
        timeComplexity: {
          best: "O(n)",
          average: "O(n²)",
          worst: "O(n²)",
        },
        spaceComplexity: "O(1)",
      },
      quick: {
        name: "Quick Sort",
        description:
          "Uses a divide-and-conquer strategy. Picks a 'pivot' element and partitions the array around it, recursively sorting the sub-arrays. Highly efficient for large datasets.",
        timeComplexity: {
          best: "O(n log n)",
          average: "O(n log n)",
          worst: "O(n²)",
        },
        spaceComplexity: "O(log n)",
      },
      merge: {
        name: "Merge Sort",
        description:
          "A stable, divide-and-conquer algorithm. Divides the array into smaller subarrays, sorts them, and then merges them back together. Guarantees O(n log n) complexity.",
        timeComplexity: {
          best: "O(n log n)",
          average: "O(n log n)",
          worst: "O(n log n)",
        },
        spaceComplexity: "O(n)",
      },
      heap: {
        name: "Heap Sort",
        description:
          "Creates a heap data structure from the array and repeatedly extracts the maximum element. Combines the benefits of good complexity with minimal space usage.",
        timeComplexity: {
          best: "O(n log n)",
          average: "O(n log n)",
          worst: "O(n log n)",
        },
        spaceComplexity: "O(1)",
      },
      insertion: {
        name: "Insertion Sort",
        description:
          "Builds the final sorted array one item at a time, by repeatedly inserting a new element into the sorted portion of the array. Efficient for small data sets and nearly sorted arrays.",
        timeComplexity: {
          best: "O(n)",
          average: "O(n²)",
          worst: "O(n²)",
        },
        spaceComplexity: "O(1)",
      },
      selection: {
        name: "Selection Sort",
        description:
          "Divides the array into a sorted and unsorted region. Repeatedly selects the smallest element from the unsorted region and adds it to the sorted region.",
        timeComplexity: {
          best: "O(n²)",
          average: "O(n²)",
          worst: "O(n²)",
        },
        spaceComplexity: "O(1)",
      },
      shell: {
        name: "Shell Sort",
        description:
          "An optimization of insertion sort that allows the exchange of items that are far apart. The algorithm repeatedly sorts subarrays using a decreasing gap sequence.",
        timeComplexity: {
          best: "O(n log n)",
          average: "O(n log² n)",
          worst: "O(n²)",
        },
        spaceComplexity: "O(1)",
      },
      cocktail: {
        name: "Cocktail Sort",
        description:
          "A variation of Bubble Sort that sorts in both directions. Traverses through the array alternating between forward and backward passes, also known as Shaker Sort.",
        timeComplexity: {
          best: "O(n)",
          average: "O(n²)",
          worst: "O(n²)",
        },
        spaceComplexity: "O(1)",
      },
    };

    // Mostrar información inicial del algoritmo
    this.updateAlgorithmInfo(this.controls.algorithm?.value || "bubble");
  }

  setupEventListeners() {
    // Modal controls
    this.openBtn?.addEventListener("click", () => this.openModal());
    this.closeBtn?.addEventListener("click", () => this.closeModal());

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Sorting controls
    this.controls.start?.addEventListener("click", () => {
      if (!this.isRunning) this.startSorting();
    });

    this.controls.reset?.addEventListener("click", () => {
      this.resetVisualization();
    });

    this.controls.size?.addEventListener("input", (e) => {
      if (!this.isRunning) {
        document.querySelector(
          'label[for="arraySize"] .value-display'
        ).textContent = e.target.value;
        this.generateArray(parseInt(e.target.value));
      }
    });

    this.controls.speed?.addEventListener("input", (e) => {
      document.querySelector(
        'label[for="sortingSpeed"] .value-display'
      ).textContent = e.target.value;
      this.animationSpeed = 110 - parseInt(e.target.value);
    });

    // Algorithm selection
    this.controls.algorithm?.addEventListener("change", (e) => {
      this.updateAlgorithmInfo(e.target.value);
    });
  }

  async resetVisualization() {
    // Detener cualquier ordenamiento en curso
    this.isRunning = false;

    // Limpiar timeouts pendientes
    if (this.timeouts) {
      this.timeouts.forEach((timeout) => clearTimeout(timeout));
      this.timeouts = [];
    }

    // Habilitar todos los controles
    this.enableControls();

    // Resetear estados visuales
    const bars = this.container.children;
    Array.from(bars).forEach((bar) => {
      bar.classList.remove(
        "comparing",
        "swapping",
        "sorted",
        "pivot",
        "current",
        "heapify",
        "merging",
        "left-partition",
        "right-partition"
      );
    });

    // Generar nuevo array
    await this.generateArray(parseInt(this.controls.size?.value || "50"));

    // Resetear estadísticas si existen
    if (this.stats) {
      this.stats = {
        comparisons: 0,
        swaps: 0,
        time: 0,
      };
      this.updateStats();
    }
  }

  enableControls() {
    if (this.controls.start) this.controls.start.disabled = false;
    if (this.controls.size) this.controls.size.disabled = false;
    if (this.controls.algorithm) this.controls.algorithm.disabled = false;
    if (this.controls.speed) this.controls.speed.disabled = false;
  }

  async generateArray(size = 50) {
    if (!this.container) return;

    // Limpiar el contenedor
    this.container.innerHTML = "";

    // Generar nuevo array
    const arraySize = size;
    this.array = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 80) + 20
    );

    // Calcular dimensiones
    const maxVal = Math.max(...this.array);
    const containerWidth = this.container.clientWidth;
    const barWidth = Math.max(8, Math.floor(containerWidth / arraySize - 4));

    // Crear barras con transición suave
    this.array.forEach((value, index) => {
      const bar = document.createElement("div");
      bar.className = "array-bar";
      bar.style.height = `${(value / maxVal) * 90}%`;
      bar.style.width = `${barWidth}px`;

      // Añadir animación de entrada
      bar.style.opacity = "0";
      bar.style.transform = "scaleY(0.5)";

      this.container.appendChild(bar);

      // Animar entrada de la barra
      requestAnimationFrame(() => {
        bar.style.opacity = "1";
        bar.style.transform = "scaleY(1)";
      });
    });

    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  async startSorting() {
    if (!this.array.length || this.isRunning) return;

    try {
      this.isRunning = true;
      this.disableControls();

      const selectedAlgorithm = this.controls.algorithm.value;
      await this.sort(selectedAlgorithm);
    } catch (error) {
      console.error("Error durante la ordenación:", error);
      this.resetVisualization();
    } finally {
      this.isRunning = false;
      this.enableControls();
    }
  }

  disableControls() {
    if (this.controls.start) this.controls.start.disabled = true;
    if (this.controls.size) this.controls.size.disabled = true;
    if (this.controls.algorithm) this.controls.algorithm.disabled = true;
    if (this.controls.speed) this.controls.speed.disabled = true;
  }

  async sort(algorithm) {
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
      case "heap":
        await this.heapSort();
        break;
      case "insertion":
        await this.insertionSort();
        break;
      case "selection":
        await this.selectionSort();
        break;
      case "shell":
        await this.shellSort();
        break;
      case "cocktail":
        await this.cocktailSort();
        break;
      default:
        console.error("Algoritmo no implementado");
    }
  }

  async bubbleSort() {
    const n = this.array.length;

    for (let i = 0; i < n - 1; i++) {
      // Añadir indicador visual para la pasada actual
      this.highlightRange(0, n - i - 1, "current-range");

      for (let j = 0; j < n - i - 1; j++) {
        // Resaltar el par que se está comparando
        this.highlightBars([j, j + 1], "comparing");
        await this.sleep();

        if (this.array[j] > this.array[j + 1]) {
          await this.swap(j, j + 1);
        }

        this.unhighlightBars([j, j + 1]);
      }

      // Marcar elemento ordenado
      this.markAsSorted(n - 1 - i);
    }
  }

  async swap(i, j) {
    // Intercambiar valores en el array
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];

    // Actualizar visualización
    const bars = this.container.children;
    const tempHeight = bars[i].style.height;
    bars[i].style.height = bars[j].style.height;
    bars[j].style.height = tempHeight;

    // Animación
    bars[i].classList.add("swapping");
    bars[j].classList.add("swapping");
    await this.sleep();
    bars[i].classList.remove("swapping");
    bars[j].classList.remove("swapping");
  }

  async sleep() {
    return new Promise((resolve) => setTimeout(resolve, this.animationSpeed));
  }

  checkContainer() {
    if (!this.container) {
      console.error("Container not found");
      return false;
    }

    // Asegurar dimensiones mínimas
    if (this.container.clientHeight < 100) {
      this.container.style.minHeight = "400px";
    }

    return true;
  }

  renderArray() {
    if (!this.checkContainer()) return;

    this.container.innerHTML = "";
    const maxVal = Math.max(...this.array);
    const containerWidth = this.container.clientWidth;
    const barWidth = Math.max(
      4,
      Math.floor(containerWidth / this.array.length - 2)
    );

    this.array.forEach((value) => {
      const bar = document.createElement("div");
      bar.className = "array-bar";

      // Calcular altura con mejor visibilidad
      const heightPercentage = (value / maxVal) * 90; // Usar 90% de la altura
      bar.style.height = `${heightPercentage}%`;
      bar.style.width = `${barWidth}px`;
      bar.setAttribute("data-value", value);

      this.container.appendChild(bar);
    });
  }

  setupStatsPanel() {
    const statsPanel = document.createElement("div");
    statsPanel.className = "stats-panel";
    statsPanel.innerHTML = `
      <div class="stat-item">
        <div class="stat-label">Comparaciones</div>
        <div class="stat-value" id="comparisons">0</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Intercambios</div>
        <div class="stat-value" id="swaps">0</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Tiempo</div>
        <div class="stat-value" id="time">0.00s</div>
      </div>
    `;

    const container = this.container.parentElement;
    const existingStats = container.querySelector(".stats-panel");
    if (existingStats) {
      container.removeChild(existingStats);
    }
    container.appendChild(statsPanel);

    this.statsElements = {
      comparisons: document.getElementById("comparisons"),
      swaps: document.getElementById("swaps"),
      time: document.getElementById("time"),
    };
  }

  updateStats() {
    if (!this.statsElements) return;

    this.statsElements.comparisons.textContent = this.stats.comparisons;
    this.statsElements.swaps.textContent = this.stats.swaps;
    this.statsElements.time.textContent = `${(this.stats.time / 1000).toFixed(
      2
    )}s`;
  }

  resetStats() {
    this.stats = {
      comparisons: 0,
      swaps: 0,
      time: 0,
    };
    this.updateStats();
  }

  async markSortingComplete() {
    const bars = this.container.children;
    const n = bars.length;

    // Verificar que está ordenado
    let isSorted = true;
    for (let i = 0; i < n - 1; i++) {
      if (this.array[i] > this.array[i + 1]) {
        isSorted = false;
        break;
      }
    }

    if (isSorted) {
      // Efecto de finalización
      for (let i = 0; i < n; i++) {
        bars[i].classList.add("sorted");
        await this.sleep(this.animationSpeed / 4);
      }

      // Mostrar mensaje de éxito
      this.showCompletionMessage();
    }
  }

  showCompletionMessage() {
    const message = document.createElement("div");
    message.className = "completion-message";
    message.innerHTML = `
      <div class="success-icon">✓</div>
      <p>¡Ordenación completada!</p>
      <div class="stats-summary">
        <div>Comparaciones: ${this.stats.comparisons}</div>
        <div>Intercambios: ${this.stats.swaps}</div>
        <div>Tiempo: ${(this.stats.time / 1000).toFixed(2)}s</div>
      </div>
    `;

    const container = this.container.parentElement;
    container.appendChild(message);

    // Remover mensaje después de 3 segundos
    setTimeout(() => {
      message.classList.add("fade-out");
      setTimeout(() => container.removeChild(message), 500);
    }, 3000);
  }

  async quickSort(low, high) {
    if (low < high) {
      // Visualizar partición actual
      this.highlightRange(low, high, "current-partition");
      await this.sleep();

      // Resaltar pivote
      const pivotIndex = high;
      this.highlightBars([pivotIndex], "pivot");
      await this.sleep();

      let pi = await this.partition(low, high);

      // Visualizar subparticiones
      if (low < pi - 1) {
        this.highlightRange(low, pi - 1, "left-partition");
      }
      if (pi + 1 < high) {
        this.highlightRange(pi + 1, high, "right-partition");
      }

      await this.quickSort(low, pi - 1);
      await this.quickSort(pi + 1, high);
    }
  }

  async partition(low, high) {
    const pivot = this.array[high];
    let i = low - 1;

    this.highlightBars([high], "pivot");
    await this.sleep();

    for (let j = low; j < high; j++) {
      this.highlightBars([j], "comparing");
      await this.sleep();

      if (this.array[j] < pivot) {
        i++;
        await this.swap(i, j);
      }
      this.unhighlightBars([j]);
    }

    await this.swap(i + 1, high);
    this.unhighlightBars([high]);
    return i + 1;
  }

  async mergeSort(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      // Visualizar la división actual
      this.highlightRange(left, mid, "left-partition");
      this.highlightRange(mid + 1, right, "right-partition");
      await this.sleep();

      await this.mergeSort(left, mid);
      await this.mergeSort(mid + 1, right);

      // Visualizar el proceso de fusión
      await this.merge(left, mid, right);
    }
  }

  async merge(left, mid, right) {
    const tempArray = [...this.array];
    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
      this.highlightBars([i, j], "comparing");
      await this.sleep();

      if (tempArray[i] <= tempArray[j]) {
        this.array[k] = tempArray[i];
        this.updateBar(k, tempArray[i], "merging");
        i++;
      } else {
        this.array[k] = tempArray[j];
        this.updateBar(k, tempArray[j], "merging");
        j++;
      }
      k++;
      await this.sleep();
    }

    while (i <= mid) {
      this.array[k] = tempArray[i];
      this.updateBar(k, tempArray[i], "merging");
      i++;
      k++;
      await this.sleep();
    }

    while (j <= right) {
      this.array[k] = tempArray[j];
      this.updateBar(k, tempArray[j], "merging");
      j++;
      k++;
      await this.sleep();
    }
  }

  async heapSort() {
    const n = this.array.length;

    // Construir heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await this.heapify(n, i);
    }

    // Extraer elementos del heap
    for (let i = n - 1; i > 0; i--) {
      await this.swap(0, i);
      this.markAsSorted(i);
      await this.heapify(i, 0);
    }
    this.markAsSorted(0);
  }

  async heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    this.highlightBars([i], "heapify");
    await this.sleep();

    if (left < n && this.array[left] > this.array[largest]) {
      largest = left;
    }

    if (right < n && this.array[right] > this.array[largest]) {
      largest = right;
    }

    if (largest !== i) {
      await this.swap(i, largest);
      await this.heapify(n, largest);
    }

    this.unhighlightBars([i]);
  }

  async insertionSort() {
    const n = this.array.length;

    for (let i = 1; i < n; i++) {
      // Resaltar el elemento actual que se va a insertar
      this.highlightBars([i], "current");
      await this.sleep();

      let key = this.array[i];
      let j = i - 1;

      // Mover elementos mayores que key a una posición adelante
      while (j >= 0 && this.array[j] > key) {
        this.highlightBars([j], "comparing");
        await this.sleep();

        this.array[j + 1] = this.array[j];
        this.updateBar(j + 1, this.array[j], "shifting");
        j--;
      }

      this.array[j + 1] = key;
      this.updateBar(j + 1, key, "inserting");

      // Marcar la sección ordenada
      for (let k = 0; k <= i; k++) {
        this.markAsSorted(k);
      }
      await this.sleep();
    }
  }

  async selectionSort() {
    const n = this.array.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // Resaltar el elemento actual como mínimo temporal
      this.highlightBars([minIdx], "current");
      await this.sleep();

      // Buscar el mínimo en el resto del array
      for (let j = i + 1; j < n; j++) {
        this.highlightBars([j], "comparing");
        await this.sleep();

        if (this.array[j] < this.array[minIdx]) {
          this.unhighlightBars([minIdx]);
          minIdx = j;
          this.highlightBars([minIdx], "minimum");
        }
        this.unhighlightBars([j]);
      }

      // Intercambiar si se encontró un nuevo mínimo
      if (minIdx !== i) {
        await this.swap(i, minIdx);
      }

      // Marcar posición como ordenada
      this.markAsSorted(i);
    }
    this.markAsSorted(n - 1);
  }

  async shellSort() {
    const n = this.array.length;

    // Calcular gap inicial
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      // Resaltar el gap actual
      this.highlightRange(0, gap, "gap-highlight");
      await this.sleep();

      // Realizar insertion sort para cada subgrupo
      for (let i = gap; i < n; i++) {
        let temp = this.array[i];
        let j;

        // Resaltar elementos que se están comparando en el subgrupo
        for (j = i; j >= gap && this.array[j - gap] > temp; j -= gap) {
          this.highlightBars([j, j - gap], "comparing");
          await this.sleep();

          this.array[j] = this.array[j - gap];
          this.updateBar(j, this.array[j - gap], "shifting");
          await this.sleep();
        }

        this.array[j] = temp;
        this.updateBar(j, temp, "inserting");
      }
    }

    // Marcar todo como ordenado
    for (let i = 0; i < n; i++) {
      this.markAsSorted(i);
      await this.sleep(50);
    }
  }

  async cocktailSort() {
    let start = 0;
    let end = this.array.length - 1;
    let swapped = true;

    while (swapped) {
      swapped = false;

      // Mover de izquierda a derecha
      for (let i = start; i < end; i++) {
        this.highlightBars([i, i + 1], "comparing");
        await this.sleep();

        if (this.array[i] > this.array[i + 1]) {
          await this.swap(i, i + 1);
          swapped = true;
        }
        this.unhighlightBars([i, i + 1]);
      }
      this.markAsSorted(end);
      end--;

      if (!swapped) break;
      swapped = false;

      // Mover de derecha a izquierda
      for (let i = end; i >= start; i--) {
        this.highlightBars([i, i + 1], "comparing-reverse");
        await this.sleep();

        if (this.array[i] > this.array[i + 1]) {
          await this.swap(i, i + 1);
          swapped = true;
        }
        this.unhighlightBars([i, i + 1]);
      }
      this.markAsSorted(start);
      start++;
    }

    // Marcar elementos restantes como ordenados
    for (let i = start; i <= end; i++) {
      this.markAsSorted(i);
    }
  }

  async compare(i, j) {
    if (!this.container) return false;

    this.stats.comparisons++;
    this.updateStats();

    const bars = this.container.children;
    if (!bars[i] || !bars[j]) return false;

    // Resaltar las barras que se están comparando
    bars[i].classList.add("comparing");
    bars[j].classList.add("comparing");

    await this.sleep();

    const result = this.array[i] > this.array[j];

    // Remover el resaltado
    bars[i].classList.remove("comparing");
    bars[j].classList.remove("comparing");

    return result;
  }

  checkVisualizerState() {
    if (!this.container) {
      console.error("Container not found");
      return false;
    }

    console.log("Container:", {
      height: this.container.clientHeight,
      width: this.container.clientWidth,
      children: this.container.children.length,
      display: getComputedStyle(this.container).display,
      visibility: getComputedStyle(this.container).visibility,
    });

    return true;
  }

  showAlgorithmInfo() {
    const algorithm = this.controls.algorithm?.value;
    const info = this.algorithmInfo[algorithm];
    if (!info) return;

    const infoContainer =
      document.querySelector(".algorithm-info") ||
      document.createElement("div");
    infoContainer.className = "algorithm-info";
    infoContainer.innerHTML = `
      <h4>${info.name}</h4>
      <p class="description">${info.description}</p>
      <div class="complexity-info">
        <div class="time-complexity">
          <h5>Time Complexity</h5>
          <ul>
            <li>Best: ${info.timeComplexity.best}</li>
            <li>Average: ${info.timeComplexity.average}</li>
            <li>Worst: ${info.timeComplexity.worst}</li>
          </ul>
        </div>
        <div class="space-complexity">
          <h5>Space Complexity</h5>
          <p>${info.spaceComplexity}</p>
        </div>
      </div>
    `;

    if (!infoContainer.parentNode) {
      this.container.parentNode.appendChild(infoContainer);
    }
  }

  resetState() {
    this.isRunning = false;
    this.array = [];
    this.stats = { comparisons: 0, swaps: 0, time: 0 };
    this.updateStats();
    if (this.controls.start) this.controls.start.disabled = false;
    if (this.controls.size) this.controls.size.disabled = false;
  }

  openModal() {
    if (!this.modal) return;

    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Generar array inicial cuando se abre el modal
    setTimeout(() => {
      this.generateArray();
    }, 100);
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove("active");
    document.body.style.overflow = "";

    // Limpiar el estado
    this.array = [];
    this.isRunning = false;
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  // Métodos auxiliares para visualización
  highlightBars(indices, className) {
    indices.forEach((i) => {
      const bar = this.container.children[i];
      if (bar) bar.classList.add(className);
    });
  }

  unhighlightBars(indices) {
    indices.forEach((i) => {
      const bar = this.container.children[i];
      if (bar) {
        bar.classList.remove("comparing", "pivot", "current");
      }
    });
  }

  highlightRange(start, end, className) {
    for (let i = start; i <= end; i++) {
      const bar = this.container.children[i];
      if (bar) bar.classList.add(className);
    }
  }

  markAsSorted(index) {
    const bar = this.container.children[index];
    if (bar) {
      bar.classList.add("sorted");
      bar.classList.remove("comparing", "pivot", "current");
    }
  }

  // Método auxiliar para actualizar la visualización de una barra
  updateBar(index, value, className) {
    const bar = this.container.children[index];
    if (bar) {
      const maxVal = Math.max(...this.array);
      const heightPercent = (value / maxVal) * 90;
      bar.style.height = `${heightPercent}%`;
      bar.classList.add(className);
      setTimeout(() => bar.classList.remove(className), 300);
    }
  }

  // Método para actualizar la información del algoritmo
  updateAlgorithmInfo(algorithm) {
    const info = this.algorithmInfo[algorithm];
    if (!info || !this.infoContainer) return;

    this.infoContainer.innerHTML = `
      <div class="algorithm-header">
        <h4>${info.name}</h4>
      </div>
      <div class="algorithm-description">
        <p>${info.description}</p>
      </div>
      <div class="complexity-info">
        <div class="time-complexity">
          <h5>Time Complexity</h5>
          <ul>
            <li><span>Best:</span> ${info.timeComplexity.best}</li>
            <li><span>Average:</span> ${info.timeComplexity.average}</li>
            <li><span>Worst:</span> ${info.timeComplexity.worst}</li>
          </ul>
        </div>
        <div class="space-complexity">
          <h5>Space Complexity</h5>
          <p>${info.spaceComplexity}</p>
        </div>
      </div>
    `;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new SortingVisualizer();
});
