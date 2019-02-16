import { Game, GameGUID, Player, PlayerGUID } from '../models';
import { EntitiesProvider } from '../store';
import { emptyField } from '../models-constants';
const uuidv1 = require('uuid/v1');

export const denormalizeGame = (game: Game<PlayerGUID>, playersStore: EntitiesProvider<Player>): Game<Player> | null => {
  let lastAction = null;
  if (game.lastAction) {
    const lastActionPlayer = playersStore.get(game.lastAction.player);
    if (!lastActionPlayer) {
      return null;
    }
    lastAction = {
      ...game.lastAction,
      player: lastActionPlayer
    };
  }
  const players = playersStore.getList(game.players);
  if (!players) {
    return null;
  }
  return {
    ...game,
    players: players,
    lastAction: lastAction
  };
};

export const deserializeGame = (string: string): Game<PlayerGUID> => {
  const game = JSON.parse(string);
  game.createDate = new Date(game.createDate);
  if (game.lastAction) {
    game.lastAction.date = new Date(game.lastAction.date);
  }
  return game;
};

let gameNameCounter = 1;

export const createGame = (): Game<PlayerGUID> => {
  return {
    id: uuidv1() as GameGUID,
    name: `Game ${gameNameCounter++}`,
    createDate: new Date(),
    players: [],
    lastAction: null,
    field: emptyField
  };
};
