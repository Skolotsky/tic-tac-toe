import { Field, FilledCellType, Game, PlayerGUID } from '../models';
import { COLUMNS_COUNT, ROWS_COUNT } from '../models-constants';

export const getAvailableCellType = (
  player: PlayerGUID,
  game: Game,
  rowIndex: number,
  columnIndex: number
): FilledCellType | null => {
  if (getWonCellType(game)) {
    return null;
  }
  if (!game.lastAction) {
    return FilledCellType.Cross;
  }
  if (game.lastAction.player === player) {
    return null;
  }
  const cell = game.field[rowIndex][columnIndex];
  if (cell) {
    return null;
  }
  switch (game.lastAction.filledCell) {
    case FilledCellType.Cross:
      return FilledCellType.Nought;
    case FilledCellType.Nought:
      return FilledCellType.Cross;
  }
};

export const fillFieldCell = (player: PlayerGUID, game: Game<PlayerGUID>, rowIndex: number, columnIndex: number) => {
  const cellType = getAvailableCellType(player, game, rowIndex, columnIndex);
  if (cellType !== null) {
    game.lastAction = {
      filledCell: cellType,
      player: player,
      date: new Date()
    };
    game.field[rowIndex][columnIndex] = cellType;
  }
};

const COUNT_TO_WIN = 3;
type Direction = -1 | 0 | 1;

const inBounds = (value: number, min: number, max: number): boolean => (
  value >= min && value <= max
);

const rowIndexInBounds = (index: number) => inBounds(index + 1, 1, ROWS_COUNT);
const columnIndexInBounds = (index: number) => inBounds(index + 1, 1, COLUMNS_COUNT);

const getWonCellTypeFromPosition = (
  field: Field,
  fromRowIndex: number,
  fromColumnIndex: number,
  rowDirection: Direction,
  columnDirection: Direction
): FilledCellType | null => {
  if (!rowDirection && !columnDirection) {
    return null;
  }
  if (!rowIndexInBounds(fromRowIndex + COUNT_TO_WIN * rowDirection)) {
    return null
  }
  if (!columnIndexInBounds(fromColumnIndex + COUNT_TO_WIN * columnDirection)) {
    return null
  }
  let equalCellsCount = 0;
  const startCell = field[fromRowIndex][fromColumnIndex];
  if (!startCell) {
    return null;
  }
  for (
    let i = fromRowIndex, j = fromColumnIndex;
    i < COUNT_TO_WIN && j < COUNT_TO_WIN;
    i += rowDirection, j += columnDirection
  ) {
    if (field[i][j] !== startCell) {
      break;
    }
    equalCellsCount++;
  }
  if (equalCellsCount === COUNT_TO_WIN) {
    return startCell;
  }
  return null;
};

export const getWonCellType = (game: Game): FilledCellType | null => {
  let wonCellType: FilledCellType | null = null;
  game.field.some(
    (row, rowIndex) => row.some(
      (cell, columnIndex) => {
        if (!cell) {
          return false;
        }
        const canBeRowWonPosition = rowIndex < (ROWS_COUNT - COUNT_TO_WIN);
        const canBeColumnWonPosition = columnIndex < (COLUMNS_COUNT - COUNT_TO_WIN);
        if (canBeRowWonPosition) {
          wonCellType = getWonCellTypeFromPosition(game.field, rowIndex, columnIndex, 1, 0);
          if (wonCellType) {
            return true;
          }
        }
        if (canBeColumnWonPosition) {
          wonCellType = getWonCellTypeFromPosition(game.field, rowIndex, columnIndex, 0, 1);
          if (wonCellType) {
            return true;
          }
        }
        if (canBeRowWonPosition && canBeColumnWonPosition) {
          wonCellType = getWonCellTypeFromPosition(game.field, rowIndex, columnIndex, 1, 1);
          if (wonCellType) {
            return true;
          }
          wonCellType = getWonCellTypeFromPosition(game.field, rowIndex + COUNT_TO_WIN, columnIndex, -1, 1);
          if (wonCellType) {
            return true;
          }
        }
        return false;
      }
    )
  );
  return wonCellType;
};
