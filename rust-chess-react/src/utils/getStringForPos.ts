export const getStringForPos = (rank: number, file: number) => {
  const fileLetter = String.fromCharCode(65 + file);
  return `${rank + 1}${fileLetter}`;
};
