import { Cell, Field, FilledCellType, Game, PlayerGUID } from '../models';
import { COLUMNS_COUNT, ROWS_COUNT } from '../constants/models';

export const getAvailableCellType = (
  player: PlayerGUID,
  game: Game,
  rowIndex: number,
  columnIndex: number
): FilledCellType | null => {
  if (isGameFinished(game)) {
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
    return true;
  }
  return false;
};

export const COUNT_TO_WIN = 5;
type Direction = -1 | 0 | 1;

const inBounds = (value: number, min: number, max: number): boolean => (
  value >= min && value <= max
);

const rowIndexInBounds = (index: number) => inBounds(index + 1, 1, ROWS_COUNT);
const columnIndexInBounds = (index: number) => inBounds(index + 1, 1, COLUMNS_COUNT);

const walkFromPosition = (
  field: Field,
  fromRowIndex: number,
  fromColumnIndex: number,
  rowDirection: Direction,
  columnDirection: Direction,
  stepsCount: number,
  stepHandler: (cell: Cell, rowIndex: number, columnIndex: number) => boolean
) => {
  if (!rowDirection && !columnDirection) {
    return null;
  }
  if (!rowIndexInBounds(fromRowIndex)) {
    return null
  }
  if (!columnIndexInBounds(fromColumnIndex)) {
    return null
  }
  if (!rowIndexInBounds(fromRowIndex + (stepsCount - 1) * rowDirection)) {
    return null
  }
  if (!columnIndexInBounds(fromColumnIndex + (stepsCount - 1) * columnDirection)) {
    return null
  }
  for (
    let i = 0, rowIndex = fromRowIndex, columnIndex = fromColumnIndex;
    i < stepsCount;
    i++, rowIndex += rowDirection, columnIndex += columnDirection
  ) {
    if (!stepHandler(field[rowIndex][columnIndex], rowIndex, columnIndex)) {
      break;
    }
  }
};

const getWonCellTypeFromPosition = (
  field: Field,
  fromRowIndex: number,
  fromColumnIndex: number,
  rowDirection: Direction,
  columnDirection: Direction
): FilledCellType | null => {
  if (!rowIndexInBounds(fromRowIndex)) {
    return null
  }
  if (!columnIndexInBounds(fromColumnIndex)) {
    return null
  }
  const startCell = field[fromRowIndex][fromColumnIndex];
  if (!startCell) {
    return null;
  }
  let equalCellsCount = 0;
  walkFromPosition(
    field,
    fromRowIndex,
    fromColumnIndex,
    rowDirection,
    columnDirection,
    COUNT_TO_WIN,
    (cell) => {
      if (cell !== startCell) {
        return false;
      }
      equalCellsCount++;
      return true;
    }
  );
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
        wonCellType =
          getWonCellTypeFromPosition(game.field, rowIndex, columnIndex, 1, 0) ||
          getWonCellTypeFromPosition(game.field, rowIndex, columnIndex, 0, 1) ||
          getWonCellTypeFromPosition(game.field, rowIndex, columnIndex, 1, 1) ||
          getWonCellTypeFromPosition(game.field, rowIndex + COUNT_TO_WIN - 1, columnIndex, -1, 1);
        return !!wonCellType;
      }
    )
  );
  return wonCellType;
};

export const isGameFinished = (game: Game): boolean => {
  let wonCellType: FilledCellType | null = getWonCellType(game);
  if (wonCellType) {
    return !!wonCellType;
  }
  return game.field.every(row => row.every(cell => !!cell));
};

export const joinGame = (game: Game, player: PlayerGUID) => {
  if (!game.players.includes(player)) {
    game.players.push(player)
  }
};
