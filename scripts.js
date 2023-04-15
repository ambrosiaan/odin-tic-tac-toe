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
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const players = [player1, player2];
  let activePlayer = players[0];

  function _changeActivePlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  function _resetGame() {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    displayController.render();
  }

  function _declareWinner(winner = "tie") {
    setTimeout(() => {
      if (winner === "tie") {
        alert("It's a tie!");
      } else {
        alert(`${winner.getName()} is the winner!`);
      }
      _resetGame();
    }, 10); // Delay the execution of _resetGame() by 10 milliseconds)
  }

  function _determineGameOver() {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    winningCombinations.forEach((comb) => {
      if (board[comb[0]] === 0) return;
      if (
        (board[comb[0]] === board[comb[1]] && board[comb[1]]) === board[comb[2]]
      ) {
        _declareWinner(activePlayer);
      }
    });
    if (board.every((element) => element !== 0)) {
      _declareWinner();
    }
  }

  function playRound(event) {
    const id = event.target.getAttribute("data-id");
    if (board[id] !== 0) return;
    gameboard.addToGameBoard(id, activePlayer.getSign());
    displayController.render();
    _determineGameOver();
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
