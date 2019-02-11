import { FilledCellType, Game, PlayerGUID } from './models';

const getAvailableCellType = (
  player: PlayerGUID,
  game: Game,
  rowIndex: number,
  columnIndex: number
): FilledCellType | null => {
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
