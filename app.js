const board = document.getElementById("board");

let cells = Array(16).fill(0);

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
