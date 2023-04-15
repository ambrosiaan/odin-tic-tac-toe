function createPlayer(name, sign) {
  const playerName = name;
  const playerSign = sign;
  return {
    getName: () => playerName,
    getSign: () => playerSign,
  };
}

const player1 = createPlayer("Bart", "X");
const player2 = createPlayer("Yvoine", "O");

const gameboard = (function () {
  const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const players = [player1, player2];
  let activePlayer = players[0];

  function _changeActivePlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function playRound(event) {
    const id = event.target.getAttribute("data-id");
    if (board[id] !== 0) return;
    gameboard.addToGameBoard(id, activePlayer.getSign());
    displayController.render();
    _changeActivePlayer();
  }

  function getGameBoard() {
    return board;
  }
  function addToGameBoard(index, value) {
    board[index] = value;
  }

  return { getGameBoard, addToGameBoard, playRound };
})();

const displayController = (function () {
  const gameBoardContainer = document.getElementById("gameBoard");

  function render() {
    const gameBoardArray = gameboard.getGameBoard();
    gameBoardContainer.innerHTML = "";
    for (let i = 0; i < gameBoardArray.length; i++) {
      const value = gameBoardArray[i];
      const newDiv = document.createElement("div");
      newDiv.classList.add("cell");
      newDiv.setAttribute("data-id", i);
      newDiv.textContent = value !== 0 ? value : "";
      newDiv.addEventListener("click", gameboard.playRound);
      gameBoardContainer.appendChild(newDiv);
    }
  }
  return { render };
})();

displayController.render();
