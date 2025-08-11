const barsContainer = document.getElementById('bars');
const generateBtn = document.getElementById('generateBtn');
const startBtn = document.getElementById('startBtn');
const sizeInput = document.getElementById('sizeInput');
const speedInput = document.getElementById('speedInput');
const sizeValue = document.getElementById('sizeValue');
const speedValue = document.getElementById('speedValue');
const algorithmSelect = document.getElementById('algorithm');

let array = [];
let isSorting = false;

// Update display labels
sizeValue.textContent = sizeInput.value;
speedValue.textContent = speedInput.value;
sizeInput.oninput = () => sizeValue.textContent = sizeInput.value;
speedInput.oninput = () => speedValue.textContent = speedInput.value;

// Generate new array from backend
async function generateArray() {
  if (isSorting) return;
  const size = parseInt(sizeInput.value, 10);

  try {
    const res = await fetch(`http://localhost:8080/api/array?size=${size}`);
    array = await res.json();

    console.log("Generated array:", array);
    renderBars(array);
  } catch (err) {
    console.error('Could not generate array', err);
    barsContainer.innerHTML = '<p style="color:#f88">Error fetching array from server</p>';
  }
}

// Render the array as bars
function renderBars(arr) {
  barsContainer.innerHTML = "";
  const percent = 100 / arr.length;
  arr.forEach(value => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${value}px`;
    bar.style.flex = `0 0 ${percent}%`;
    barsContainer.appendChild(bar);
  });
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Disable/enable controls while sorting
function setControlsDisabled(disabled) {
  generateBtn.disabled = disabled;
  startBtn.disabled = disabled;
  sizeInput.disabled = disabled;
  speedInput.disabled = disabled;
  algorithmSelect.disabled = disabled;
}

// Bubble sort
async function bubbleSort() {
  const bars = document.getElementsByClassName('bar');
  const delay = parseInt(speedInput.value, 10);

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      bars[j].style.backgroundColor = '#ff5252';
      bars[j+1].style.backgroundColor = '#ff5252';

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = array[j] + 'px';
        bars[j+1].style.height = array[j+1] + 'px';
      }

      await sleep(delay);
      bars[j].style.backgroundColor = '';
      bars[j+1].style.backgroundColor = '';
    }
  }
}

// Selection sort
async function selectionSort() {
  const bars = document.getElementsByClassName('bar');
  const delay = parseInt(speedInput.value, 10);

  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    bars[i].style.backgroundColor = '#4444ff';
    for (let j = i + 1; j < array.length; j++) {
      bars[j].style.backgroundColor = '#ff5252';
      await sleep(delay);

      if (array[j] < array[minIndex]) {
        if (minIndex !== i) bars[minIndex].style.backgroundColor = '';
        minIndex = j;
        bars[minIndex].style.backgroundColor = '#00e676';
      } else {
        bars[j].style.backgroundColor = '';
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      bars[i].style.height = array[i] + 'px';
      bars[minIndex].style.height = array[minIndex] + 'px';
    }

    bars[i].style.backgroundColor = '';
    if (minIndex !== i) bars[minIndex].style.backgroundColor = '';
  }
}

// Insertion sort
async function insertionSort() {
  const bars = document.getElementsByClassName('bar');
  const delay = parseInt(speedInput.value, 10);

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    bars[i].style.backgroundColor = '#ff5252';
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = array[j + 1] + 'px';
      j--;
      await sleep(delay);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = key + 'px';
    bars[i].style.backgroundColor = '';
    await sleep(delay);
  }
}
// --- Existing code above remains unchanged ---

// MERGE SORT
async function mergeSort(left = 0, right = array.length - 1) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);

  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  const delay = parseInt(speedInput.value, 10);
  const bars = document.getElementsByClassName("bar");

  let leftArr = array.slice(left, mid + 1);
  let rightArr = array.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    bars[k].style.backgroundColor = "#ff9800"; // comparing

    if (leftArr[i] <= rightArr[j]) {
      array[k] = leftArr[i++];
    } else {
      array[k] = rightArr[j++];
    }

    bars[k].style.height = array[k] + "px";
    await sleep(delay);
    bars[k].style.backgroundColor = "";
    k++;
  }

  while (i < leftArr.length) {
    array[k] = leftArr[i++];
    bars[k].style.height = array[k] + "px";
    await sleep(delay);
    k++;
  }

  while (j < rightArr.length) {
    array[k] = rightArr[j++];
    bars[k].style.height = array[k] + "px";
    await sleep(delay);
    k++;
  }
}

// QUICK SORT
async function quickSort(low = 0, high = array.length - 1) {
  if (low < high) {
    const pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  const delay = parseInt(speedInput.value, 10);
  const bars = document.getElementsByClassName("bar");

  let pivot = array[high];
  let i = low - 1;

  bars[high].style.backgroundColor = "#00e676"; // pivot

  for (let j = low; j < high; j++) {
    bars[j].style.backgroundColor = "#ff5252"; // comparing
    await sleep(delay);

    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      bars[i].style.height = array[i] + "px";
      bars[j].style.height = array[j] + "px";
    }

    bars[j].style.backgroundColor = "";
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  bars[i + 1].style.height = array[i + 1] + "px";
  bars[high].style.height = array[high] + "px";

  bars[high].style.backgroundColor = "";
  return i + 1;
}

// Start sorting
async function startSort() {
  if (isSorting) return;
  isSorting = true;
  setControlsDisabled(true);

  const algo = algorithmSelect.value;
  if (algo === 'bubble') await bubbleSort();
  else if (algo === 'selection') await selectionSort();
  else if (algo === 'insertion') await insertionSort();
  else if (algo === 'merge') await mergeSort();
  else if (algo === 'quick') await quickSort();

  setControlsDisabled(false);
  isSorting = false;
}


// Start sorting
async function startSort() {
  if (isSorting) return;
  isSorting = true;
  setControlsDisabled(true);

  const algo = algorithmSelect.value;
  if (algo === 'bubble') await bubbleSort();
  else if (algo === 'selection') await selectionSort();
  else if (algo === 'insertion') await insertionSort();
  else if (algo === 'merge') await mergeSort();
  else if (algo === 'quick') await quickSort();

  setControlsDisabled(false);
  isSorting = false;
}

// Event listeners
generateBtn.addEventListener('click', generateArray);
startBtn.addEventListener('click', startSort);

// Initial array on page load
generateArray();
