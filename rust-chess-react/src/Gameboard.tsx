import { GameHandler, get_piece_for_display } from "rust-chess-wasm";
import "./Gameboard.css";

export type Props = {
  gameHandler: GameHandler;
};

export default function Gameboard({ gameHandler }: Props) {
  // 0 starts at the bottom
  const rankAndFiles = Array.from(new Array(64), (x, i) => 64 - i - 1);

  return (
    <div className="board">
      {rankAndFiles.map((i) => {
        const rank = Math.floor(i / 8);
        const file = i % 8;
        return (
          <BoardTile
            rank={rank}
            file={file}
            gameHandler={gameHandler}
            key={i}
          />
        );
      })}
    </div>
  );
}

type BoardTileProps = {
  rank: number;
  file: number;
  gameHandler: GameHandler;
};

const BoardTile = ({ rank, file, gameHandler }: BoardTileProps) => {
  const tileColor = (rank + file) % 2 === 0 ? "light" : "dark";
  return (
    <div className={tileColor}>
      <span className="piece">
        {get_piece_for_display(gameHandler, rank, file)}
      </span>
    </div>
  );
};
