import "./App.css";
import { gen_game } from "rust-chess-wasm";
import Gameboard from "./Gameboard";

function App() {
  return (
    <div className="App">
      <Gameboard gameHandler={gen_game()} />
    </div>
  );
}

export default App;
