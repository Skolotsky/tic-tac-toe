import { Game, PlayerGUID } from '@common/models';
import { Store } from './Store';

export class GamesStore extends Store<Game<PlayerGUID>> {
  constructor() {
    super();
  }
}

export const gamesStore = new GamesStore();
