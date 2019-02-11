import { GameGUID, GameInfo } from '../common/models';
import { Store } from './Store';

export class GameInfosStore extends Store<GameGUID, GameInfo> {
  constructor() {
    super();
  }
}

export const gameInfosStore = new GameInfosStore();
