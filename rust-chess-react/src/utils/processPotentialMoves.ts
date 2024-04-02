import {
  source_rank,
  source_file,
  dest_rank,
  dest_file,
  PositionSourceDest,
} from "rust-chess-wasm";

export const processPotentialMoves = (
  potentialMoves: PositionSourceDest[]
): { [key: number]: Set<number> } => {
  const move_map: { [key: number]: Set<number> } = {};

  potentialMoves.forEach((psd) => {
    const sourceRank = source_rank(psd);
    const sourceFile = source_file(psd);

    const sourceIndex = sourceRank * 8 + sourceFile;

    const destRank = dest_rank(psd);
    const destFile = dest_file(psd);

    const destIndex = destRank * 8 + destFile;

    if (sourceIndex in move_map) {
      move_map[sourceIndex].add(destIndex);
    } else {
      move_map[sourceIndex] = new Set([destIndex]);
    }
  });

  return move_map;
};
