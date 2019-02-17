import { Field, Game, GameGUID, PlayerGUID } from '../models';
import { COLUMNS_COUNT, ROWS_COUNT } from '../constants/models';
import { tuple } from '../tuple';

export const deserializeGame = (string: string): Game<PlayerGUID> => {
  const game = JSON.parse(string);
  game.createDate = new Date(game.createDate);
  if (game.lastAction) {
    game.lastAction.date = new Date(game.lastAction.date);
  }
  return game;
};

let gameNameCounter = 1;

export const createGame = (id: GameGUID): Game<PlayerGUID> => {
  return {
    id,
    name: `Game ${gameNameCounter++}`,
    createDate: new Date(),
    players: [],
    lastAction: null,
    field: tuple(ROWS_COUNT, () => tuple(COLUMNS_COUNT, () => null)) as Field
  };
};
