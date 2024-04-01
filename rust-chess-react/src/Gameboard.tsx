import {
  GameHandler,
  get_piece_for_display,
  make_move,
  get_all_moves,
  source_rank,
  source_file,
  dest_rank,
  dest_file,
  PositionSourceDest,
} from "rust-chess-wasm";
import "./Gameboard.css";
import { useEffect, useState } from "react";

export type Props = {
  gameHandler: GameHandler;
};

export default function Gameboard({ gameHandler }: Props) {
  // 0 starts at the bottom
  const rankAndFiles = Array.from(new Array(64), (x, i) => i);
  const [moves, setMoves] = useState<string[]>([]);

  const [potentialMoves, _] = useState<PositionSourceDest[]>(
    get_all_moves(gameHandler)
  );

  // FOR TESTING
  useEffect(() => {
    potentialMoves.forEach((psd) => {
      console.log(
        `Source rank: ${source_rank(psd)}, Source file: ${source_file(
          psd
        )}, Dest rank: ${dest_rank(psd)}, Dest file: ${dest_file(psd)}`
      );
    });
  }, [potentialMoves]);

  return (
    <div className="container">
      <div className="board">
        {rankAndFiles.map((i) => {
          const rank = 7 - Math.floor(i / 8);
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
      <div className="moves">
        <h1 className="moves-title">Moves</h1>
        {moves.map((move) => (
          <span>{move}</span>
        ))}
      </div>
      <button
        onClick={() => {
          console.log(make_move(gameHandler, 1, 0, 2, 0));
          setMoves((moves) => [
            ...moves,
            `${getStringForPos(1, 0)}-${getStringForPos(2, 0)}`,
          ]);
        }}
      >
        FOR TESTING
      </button>
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

export const getStringForPos = (rank: number, file: number) => {
  const fileLetter = String.fromCharCode(65 + file);
  return `${rank + 1}${fileLetter}`;
};

export const processPotentialMoves = (potentialMoves: PositionSourceDest[]) => {
  const move_map = {};

  potentialMoves.forEach((psd) => {
    console.log(
      `Source rank: ${source_rank(psd)}, Source file: ${source_file(
        psd
      )}, Dest rank: ${dest_rank(psd)}, Dest file: ${dest_file(psd)}`
    );
  });

  return move_map;
};
