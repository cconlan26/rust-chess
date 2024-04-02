import {
  GameHandler,
  get_piece_for_display,
  make_move,
  get_all_moves,
} from "rust-chess-wasm";
import "./Gameboard.css";
import { useCallback, useMemo, useRef, useState } from "react";
import BoardTile from "./BoardTile";
import { processPotentialMoves } from "./utils/processPotentialMoves";
import { getStringForPos } from "./utils/getStringForPos";

export type Props = {
  gameHandler: GameHandler;
};

export default function Gameboard({ gameHandler }: Props) {
  // 0 starts at the bottom
  const rankAndFiles = Array.from(new Array(64), (x, i) => i);
  const [moves, setMoves] = useState<string[]>([]);

  const [draggedPiece, setDraggedPiece] = useState<number | undefined>();

  const [potentialMoves, setPotentialMoves] = useState<{
    [key: number]: Set<number>;
  }>(processPotentialMoves(get_all_moves(gameHandler)));

  const movesForDraggedPiece = useMemo(() => {
    return (
      (draggedPiece != null ? potentialMoves[draggedPiece] : undefined) ??
      new Set<number>()
    );
  }, [draggedPiece, potentialMoves]);

  const makeMove = useCallback(
    (destRank: number, destFile: number) => {
      if (draggedPiece == null) {
        console.log("Dragged piece is null");
        return;
      }

      const sourceRank = Math.floor(draggedPiece / 8);
      const sourceFile = draggedPiece % 8;

      //TEST MOVE REMOVE
      const pieceToMove = get_piece_for_display(
        gameHandler,
        sourceRank,
        sourceFile
      );
      const pieceAtDest = get_piece_for_display(
        gameHandler,
        destRank,
        destFile
      );

      if (!make_move(gameHandler, sourceRank, sourceFile, destRank, destFile)) {
        console.log("Move was invalid!");
        return;
      }

      setMoves((moves) => [
        ...moves,
        `${pieceToMove} ${getStringForPos(
          sourceRank,
          sourceFile
        )}-${getStringForPos(destRank, destFile)} ${pieceAtDest}`,
      ]);
    },
    [draggedPiece, gameHandler]
  );

  // FOR TESTING
  //   useEffect(() => {
  //     potentialMoves.forEach((psd) => {
  //       console.log(
  //         `Source rank: ${source_rank(psd)}, Source file: ${source_file(
  //           psd
  //         )}, Dest rank: ${dest_rank(psd)}, Dest file: ${dest_file(psd)}`
  //       );
  //     });
  //   }, [potentialMoves]);

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
              setDraggedPiece={setDraggedPiece}
              isEligibleForMove={movesForDraggedPiece.has(rank * 8 + file)}
              makeMove={makeMove}
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
          //TEST MOVE REMOVE
          const pieceToMove = get_piece_for_display(gameHandler, 1, 0);
          const pieceAtDest = get_piece_for_display(gameHandler, 2, 0);
          console.log(make_move(gameHandler, 1, 0, 2, 0));
          setMoves((moves) => [
            ...moves,
            `${pieceToMove} ${getStringForPos(1, 0)}-${getStringForPos(
              2,
              0
            )} ${pieceAtDest}`,
          ]);
        }}
      >
        FOR TESTING
      </button>
    </div>
  );
}
