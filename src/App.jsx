import { useState } from "react";
import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[gameTurns.length - 1].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [gameBoard, setGameBoard] = useState(initialGameBoard);
  const activePlayer = deriveActivePlayer(gameTurns);

  function updateGameBoard(turns) {
    const newBoard = initialGameBoard.map((row) => row.slice());
    for (const turn of turns) {
      const { square, player } = turn;
      const { row, col } = square;
      newBoard[row][col] = player;
    }
    return newBoard;
  }

  const updatedGameBoard = updateGameBoard(gameTurns);

  console.log("Game Turns: ", gameTurns);
  console.log("Updated Game Board: ", updatedGameBoard);

  let winner = null;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      updatedGameBoard[combination[0].row][combination[0].col];
    const secondSquareSymbol =
      updatedGameBoard[combination[1].row][combination[1].col];
    const thirdSquareSymbol =
      updatedGameBoard[combination[2].row][combination[2].col];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = firstSquareSymbol;
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    console.log("Square selected: ", rowIndex, colIndex);
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);
      const updatedTurns = [
        ...prevTurns,
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
      ];
      setGameBoard(updateGameBoard(updatedTurns));
      console.log("Updated Turns: ", updatedTurns);
      return updatedTurns;
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} />}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          board={updatedGameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
