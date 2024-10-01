let currentSpeed = 500;
let isRunning = false;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startSimulation() {
  if (isRunning) {
    return;
  }
  document.getElementById("board").style.boxShadow = "0px 10px 40px #131313f2";
  const n = parseInt(document.getElementById("nValueRange").value);
  if (n > 10 || n < 4) {
    alert("Please Enter a valid Number");
    return;
  }
  isRunning = true;
  document.getElementById("restartButton").style.display = "none"; // Hide restart button
  clearConfetti(); // Clear previous confetti
  const board = Array.from({ length: n }, () => Array(n).fill(false));
  drawBoard(n);
  const solved = await solveNQueens(board, 0, n);
  if (solved) {
    document.getElementById("board").style.boxShadow =
      "0px 10px 40px #FFD700";
    showConfetti();
    isRunning = false;
  } // Show confetti if solved
}

function drawBoard(n) {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${n}, 50px)`;
  boardDiv.style.gridTemplateRows = `repeat(${n}, 50px)`;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if ((i + j) % 2 === 0) cell.classList.add("black");
      cell.id = `cell-${i}-${j}`;
      boardDiv.appendChild(cell);
    }
  }
}

async function solveNQueens(board, col, n) {
  if (col === n) return true;

  for (let row = 0; row < n; row++) {
    if (isSafe(board, row, col, n)) {
      board[row][col] = true;
      const cell = document.getElementById(`cell-${row}-${col}`);
      cell.classList.add("queen", "active");
      await sleep(currentSpeed);

      if (await solveNQueens(board, col + 1, n)) return true;

      cell.classList.remove("active");
      cell.classList.add("backtrack");
      board[row][col] = false;
      await sleep(currentSpeed);
      cell.classList.remove("queen", "backtrack");
    }
    else {
      const cell = document.getElementById(`cell-${row}-${col}`);
      cell.classList.add("queen", "backtrack");
      await sleep(currentSpeed);
      cell.classList.remove("queen", "backtrack");
    }
  }
  return false;
}

function isSafe(board, row, col, n) {
  for (let i = 0; i < col; i++) if (board[row][i]) return false;

  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;

  for (let i = row, j = col; i < n && j >= 0; i++, j--) if (board[i][j]) return false;

  return true;
}

document.getElementById("speedRange").addEventListener("input", function () {
  currentSpeed = parseInt(this.value);
  document.getElementById("speedValue").textContent = `${this.value} ms`;
});

document.getElementById("nValueRange").addEventListener("input", function () {
  document.getElementById("nValueDisplay").textContent = this.value;
});

function showConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confettiContainer.appendChild(confetti);
  }
  document.getElementById("restartButton").style.display = "block"; // Show restart button
}

function clearConfetti() {
  const confettiContainer = document.getElementById("confetti-container");
  confettiContainer.innerHTML = "";
}

function restartGame() {
  clearConfetti();
  document.getElementById("board").innerHTML = "";
  document.getElementById("restartButton").style.display = "none";
  document.getElementById("board").style.boxShadow = "none";
}
