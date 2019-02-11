import { Game, GameGUID, PlayerGUID } from '../common/models';
import { Store } from './Store';

export class GamesStore extends Store<GameGUID, Game<PlayerGUID>> {
  constructor() {
    super();
  }
}

export const gamesStore = new GamesStore();
