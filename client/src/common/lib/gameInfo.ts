import { Game, GameGUID, GameInfo } from '../models';
import { EntityProvider } from '../store';
import { getWonCellType } from './rules';

export const getGameInfo = (store: EntityProvider<Game>, id: GameGUID): GameInfo | null => {
  const game = store.get(id);
  if (game) {
    return {
      id,
      name: game.name,
      lastActionDate: game.lastAction ? game.lastAction.date : game.createDate,
      playersCount: game.players.length,
      finished: !!getWonCellType(game)
    }
  }
  return null;
};

export const deserializeGameInfo = (string: string): GameInfo => {
  const gameInfo = JSON.parse(string);
  gameInfo.lastActionDate = gameInfo.lastActionDate && (new Date(gameInfo.lastActionDate));
  return gameInfo;
};
