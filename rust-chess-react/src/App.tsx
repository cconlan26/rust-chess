import { useState } from "react";
import "./App.css";
import { gen_game, GameHandler } from "rust-chess-wasm";
import Gameboard from "./Gameboard";

function App() {
  const [gameHandler, setGameHandler] = useState<GameHandler | undefined>(
    undefined
  );

  if (gameHandler != null) {
    return <Gameboard gameHandler={gameHandler} />;
  }

  return (
    <div className="App">
      <button
        onClick={() => {
          setGameHandler(gen_game());
        }}
      >
        New game
      </button>
    </div>
  );
}

export default App;
