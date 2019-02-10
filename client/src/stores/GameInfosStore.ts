import { Game, GameGUID, GameInfo, PlayerGUID } from '../common/models';
import { game } from '../mocks';
import { Store } from './Store';

export class GameInfosStore extends Store<GameGUID, GameInfo> {
  constructor() {
    super();
  }
}

export const gameInfosStore = new GameInfosStore();
