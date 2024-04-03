import {
  GameHandler,
  GameState,
  get_piece_for_display,
  make_move,
  gen_random_move,
  get_all_moves,
  source_rank,
  source_file,
  dest_rank,
  dest_file,
} from "rust-chess-wasm";
import "./Gameboard.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import BoardTile from "./BoardTile";
import { processPotentialMoves } from "./utils/processPotentialMoves";
import { getStringForPos } from "./utils/getStringForPos";

const ALL_CHESS_FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ALL_CHESS_RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

export type Props = {
  gameHandler: GameHandler;
};

export default function Gameboard({ gameHandler }: Props) {
  // 0 starts at the bottom
  const rankAndFiles = Array.from(new Array(64), (x, i) => i);
  const [moves, setMoves] = useState<string[]>([]);

  const [gameState, setGameState] = useState<GameState>(GameState.PlayerTurn);

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

  const addMoveToHistory = useCallback(
    (
      sourceRank: number,
      sourceFile: number,
      destRank: number,
      destFile: number
    ) => {
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

      setMoves((moves) => [
        ...moves,
        `${pieceToMove} ${getStringForPos(
          sourceRank,
          sourceFile
        )}-${getStringForPos(destRank, destFile)} ${pieceAtDest}`,
      ]);
    },
    [gameHandler]
  );

  // Handle new game states
  useEffect(() => {
    console.log(`Current game state is ${GameState[gameState]}`);

    if (gameState === GameState.OpponentTurn) {
      // Now make the opponent move and update accordingly
      const randomMove = gen_random_move(gameHandler);
      const sourceRank = source_rank(randomMove);
      const sourceFile = source_file(randomMove);
      const destRank = dest_rank(randomMove);
      const destFile = dest_file(randomMove);

      addMoveToHistory(sourceRank, sourceFile, destRank, destFile);
      setGameState(
        make_move(
          gameHandler,
          sourceRank,
          sourceFile,
          destRank,
          destFile,
          false // is_player
        )
      );

      // Now we can update the user with their new possible moves
      setPotentialMoves(processPotentialMoves(get_all_moves(gameHandler)));
    }
  }, [addMoveToHistory, gameHandler, gameState]);

  const makeMove = useCallback(
    (destRank: number, destFile: number) => {
      if (draggedPiece == null) {
        console.log("Dragged piece is null");
        return;
      }

      const sourceRank = Math.floor(draggedPiece / 8);
      const sourceFile = draggedPiece % 8;

      addMoveToHistory(sourceRank, sourceFile, destRank, destFile);
      setGameState(
        make_move(
          gameHandler,
          sourceRank,
          sourceFile,
          destRank,
          destFile,
          true // is_player
        )
      );
    },
    [addMoveToHistory, draggedPiece, gameHandler]
  );

  return (
    <div className="container">
      <div className="board-wrapper">
        <div className="ranks">
          {ALL_CHESS_RANKS.map((rank) => (
            <span>{rank}</span>
          ))}
        </div>
        <div className="boardWithFiles">
          <div className="files">
            {ALL_CHESS_FILES.map((file) => (
              <span>{file}</span>
            ))}
          </div>
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
                  canMakeMove={gameState === GameState.PlayerTurn}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="moves">
        <h1 className="moves-title">Moves</h1>
        <ol className="moves-list">
          {moves.map((move) => (
            <li>{move}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
