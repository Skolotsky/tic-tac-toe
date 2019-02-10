import { Game, PlayerGUID } from '../common/models';
import { Nominal } from '../common/types';

export type SerializedGameString = Nominal<'SerializedGameString'>;

export const serializeGame = (game: Game<PlayerGUID>): SerializedGameString => {
  return JSON.stringify(game) as SerializedGameString;
};

export const deserializeGame = (string: SerializedGameString): Game<PlayerGUID> => {
  const game = JSON.parse(string);
  game.createDate = new Date(game.createDate);
  if (game.lastAction) {
    game.lastAction.date = new Date(game.lastAction.date);
  }
  return game;
};
