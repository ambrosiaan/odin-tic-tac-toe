function createPlayer(name, sign) {
  const playerName = name;
  const playerSign = sign;
  let playerScore = 0;

  return {
    getName: () => playerName,
    getSign: () => playerSign,
    getPlayerScore: () => playerScore,
    addPoint: () => playerScore++,
  };
}

const gameboard = (function () {
  let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const players = [];
  let activePlayer = players[0];

  function _changeActivePlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    displayController.updateActivePlayer(activePlayer);
  }

  function newGame(player1Name, player2Name) {
    players.length = 0;
    const player1 = createPlayer(player1Name, "X");
    const player2 = createPlayer(player2Name, "O");
    players.push(player2);
    players.push(player1);
    _changeActivePlayer();
    displayController.updateScoreboard(
      players[0].getPlayerScore(),
      players[1].getPlayerScore()
    );
    resetRound();
  }

  function resetRound() {
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    displayController.renderGameBoard();
    displayController.updateActivePlayer(activePlayer);
  }

  function _declareWinner(winner = "tie") {
    setTimeout(() => {
      if (winner === "tie") {
        displayController.endRoundMessage("It's a tie!");
      } else {
        activePlayer.addPoint();
        displayController.endRoundMessage(`${winner.getName()} is the winner!`);
        console.log(
          `Player1: ${players[0].getPlayerScore()}, Player2: ${players[1].getPlayerScore()}`
        );
        displayController.updateScoreboard(
          players[0].getPlayerScore(),
          players[1].getPlayerScore()
        );
      }
      resetRound();
    }, 10); // Delay the execution of _resetRound() by 10 milliseconds)
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
    displayController.renderGameBoard();
    _determineGameOver();
    _changeActivePlayer();
  }

  function getGameBoard() {
    return board;
  }
  function addToGameBoard(index, value) {
    board[index] = value;
  }

  return { getGameBoard, addToGameBoard, playRound, resetRound, newGame };
})();

const displayController = (function () {
  const gameBoardContainer = document.getElementById("gameBoard");
  const inputModal = document.getElementById("playerInputModal");
  const closeButton = inputModal.querySelector(".close");
  const startButton = document.getElementById("startGame");
  const resetButton = document.getElementById("resetGame");
  const submitButton = document.getElementById("submitNames");
  const messageDisplay = document.getElementById("endRoundMessage");
  const currentPlayerDisplay = document.getElementById("currentPlayer");
  const player1Display = document.getElementById("player1Name");
  const player2Display = document.getElementById("player2Name");
  const player1NameDisplay = document.getElementById("player1");
  const player2NameDisplay = document.getElementById("player2");
  const player1Score = document.getElementById("player1Score");
  const player2Score = document.getElementById("player2Score");

  inputModal.classList.remove("hidden");

  closeButton.addEventListener("click", () => {
    inputModal.classList.add("hidden");
  });

  startButton.addEventListener("click", () => {
    inputModal.classList.remove("hidden");
  });

  resetButton.addEventListener("click", () => {
    gameboard.resetRound();
  });

  submitButton.addEventListener("click", () => {
    inputModal.classList.add("hidden");
    const player1Name = player1NameDisplay.value;
    const player2Name = player2NameDisplay.value;
    gameboard.newGame(player1Name, player2Name);
    _updateNameDisplay(player1Name, player2Name);
  });

  function renderGameBoard() {
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

  function _updateNameDisplay(name1, name2) {
    player1Display.innerText = `${name1} (X)`;
    player2Display.innerText = `${name2} (O)`;
  }

  function updateActivePlayer(activePlayer) {
    currentPlayerDisplay.innerText = `${activePlayer.getName()} (${activePlayer.getSign()} )`;
  }

  function endRoundMessage(text) {
    messageDisplay.innerText = text;
    messageDisplay.classList.remove("hidden");
    setTimeout(() => {
      messageDisplay.classList.add("hidden");
    }, 3000);
  }

  function updateScoreboard(score1, score2) {
    player1Score.innerText = score1;
    player2Score.innerText = score2;
  }

  return {
    renderGameBoard,
    updateActivePlayer,
    endRoundMessage,
    updateScoreboard,
  };
})();

gameboard.newGame("Player1", "Player2");

displayController.renderGameBoard();
