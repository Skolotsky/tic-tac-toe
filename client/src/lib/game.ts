import { Game, Player, PlayerGUID } from '../common/models';
import { PlayersStore } from '../stores/PlayersStore';

export const denormalizeGame = (game: Game<PlayerGUID>, playersStore: PlayersStore): Game<Player> | null => {
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
export const serializeGame = (game: Game<PlayerGUID>): string => {
  return JSON.stringify(game);
};

export const deserializeGame = (string: string): Game<PlayerGUID> => {
  const game = JSON.parse(string);
  game.createDate = new Date(game.createDate);
  if (game.lastAction) {
    game.lastAction.date = new Date(game.lastAction.date);
  }
  return game;
};
