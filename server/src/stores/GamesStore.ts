import { Game, GameGUID, PlayerGUID } from '@common/models';
import { game } from '../mocks';
import { Store } from './Store';

export class GamesStore extends Store<GameGUID, Game<PlayerGUID>> {
  constructor() {
    super();
    this.entitiesMap.set(game.id, game);
  }
}

export const gamesStore = new GamesStore();
