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

function move(direction) {
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
  }
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    move(e.key);
  }
});
