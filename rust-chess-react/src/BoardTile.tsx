import { GameHandler, get_piece_for_display } from "rust-chess-wasm";
import "./BoardTile.css";
import { useState } from "react";

type Props = {
  rank: number;
  file: number;
  gameHandler: GameHandler;
  setDraggedPiece: (piece: number | undefined) => void;
  isEligibleForMove: boolean;
  makeMove: (rank: number, file: number) => void;
  canMakeMove: boolean;
};

export default function BoardTile({
  rank,
  file,
  gameHandler,
  setDraggedPiece,
  isEligibleForMove,
  makeMove,
  canMakeMove,
}: Props) {
  const tileColor = (rank + file) % 2 === 0 ? "light" : "dark";
  // const [isDraggedInto, setIsDraggedInto] = useState(false);
  const piece = get_piece_for_display(gameHandler, rank, file);
  return (
    <div
      className={tileColor}
      onDragStart={() => {
        console.log(piece);
        setDraggedPiece(rank * 8 + file);
      }}
      onDragEnd={() => {
        setDraggedPiece(undefined);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDrop={(e) => {
        // e.stopPropagation();
        // e.preventDefault();
        console.log(piece, isEligibleForMove);
        if (isEligibleForMove) {
          makeMove(rank, file);
          console.log(`Move made with rank ${rank} and file ${file}`);
        }
      }}
      draggable={piece !== " " && canMakeMove}
    >
      {isEligibleForMove && <div className="isEligible" />}
      <span className="piece">{piece}</span>
    </div>
  );
}
