const board = document.getElementById("board");
const score = document.getElementById("score");
const gameOver = document.getElementById("gameOver");

const timerElement = document.getElementById("timer");

const playMusic = document.getElementById("music-btn-play");
const pauseMusic = document.getElementById("music-btn-pause");
const backgroundMusic = document.getElementById("backgroundMusic");

let cells = Array(16).fill(0);
let scoreValue = 0;
let gameRunning = true;

let timerInterval = null;
let timeElapsed = 0;
let timerStarted = false;

function initGrid(params) {
  board.innerHTML = "";

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    board.appendChild(cell);
  }
}

function updateDisplay() {
  const tiles = document.querySelectorAll(".cell");

  cells.forEach((value, index) => {
    tiles[index].textContent = value || "";
    tiles[index].setAttribute("data-value", value);
  });

  score.textContent = scoreValue;
}

function checkGameOver() {
  //if cells includes 0 game continue
  if (cells.includes(0)) return false;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const currentIndex = row * 4 + col;
      const nextIndex = currentIndex + 1;

      //if rows are equal game continue
      if (cells[currentIndex] === cells[nextIndex]) {
        return false;
      }
    }
  }
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const currentIndex = row * 4 + col;
      const nextIndex = currentIndex + 4;

      //if columns are equal game continue
      if (cells[currentIndex] === cells[nextIndex]) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {
  if (cells.includes(2048)) {
    gameRunning = false;
    gameOver.querySelector("h1").textContent = "YOU WIN!";
    isGameOver("win");
    return true;
  }

  return false;
}

function restartGame() {
  gameRunning = true;
  scoreValue = 0;
  cells = Array(16).fill(0);
  timeElapsed = 0;
  timerStarted = false;
  clearInterval(timerInterval);

  //reset ui
  gameOver.style.display = "none";
  score.textContent = "0";
  timerElement.textContent = "0:00";
  initGrid();
  addNewTile();
  addNewTile();
  updateDisplay();
}

function addNewTile() {
  const emptyCells = cells.reduce((acc, cell, index) => {
    if (cell === 0) acc.push(index);

    return acc;
  }, []);

  if (emptyCells.length > 0) {
    const randomCellIndex =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    cells[randomCellIndex] = Math.random() < 0.9 ? 2 : 4;
  }
}

initGrid();
addNewTile();
addNewTile();
updateDisplay();

function isGameOver(type = "lose") {
  gameRunning = false;
  clearInterval(timerInterval);
  gameOver.style.display = "flex";

  const message =
    type === "win" ? "YOU WIN!" : `YOU LOSE! \nScore: ${scoreValue}`;

  gameOver.querySelector("h1").textContent = message;
}

// Timer function
function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerElement.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

function move(direction) {
  //check if game running
  if (!gameRunning) return;

  //start timer on first move
  if (!timerStarted) {
    timerStarted = true;
    startTimer();
  }

  function getLine(i) {
    switch (direction) {
      //up to down
      case "ArrowUp":
        return [i, i + 4, i + 8, i + 12];
      //down to up
      case "ArrowDown":
        return [i + 12, i + 8, i + 4, i];
      //left to right
      case "ArrowLeft":
        return [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3];
      //right to left
      case "ArrowRight":
        return [i * 4 + 3, i * 4 + 2, i * 4 + 1, i * 4];
    }
  }

  //merge numbers in line
  function mergeLine(line) {
    let result = line.filter((x) => x !== 0);

    //merge same numbers
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        result[i] *= 2;
        scoreValue += result[i];
        result.splice(i + 1, 1);
      }
    }

    //add zeros
    while (result.length < 4) result.push(0);

    return result;
  }

  const oldCells = [...cells];

  for (let i = 0; i < 4; i++) {
    const line = getLine(i); //get index of line
    const values = line.map((pos) => cells[pos]); //get values of line
    const merged = mergeLine(values); //merge line

    //save numbers in line
    line.forEach((pos, index) => {
      cells[pos] = merged[index];
    });
  }

  //check if moved
  const moved = cells.some((cell, index) => cell !== oldCells[index]);

  if (moved) {
    addNewTile();
    updateDisplay();

    if (!checkWin()) {
      if (checkGameOver()) {
        isGameOver("lose");
      }
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    move(e.key);
  }
});

playMusic.addEventListener("click", () => {
  backgroundMusic.play();
  backgroundMusic.volume = 0.2;
  playMusic.classList.add("hidden");
  pauseMusic.classList.remove("hidden");
});

pauseMusic.addEventListener("click", () => {
  backgroundMusic.pause();
  backgroundMusic.volume = 0.2;
  playMusic.classList.remove("hidden");
  pauseMusic.classList.add("hidden");
});
