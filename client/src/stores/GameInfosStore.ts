import { GameInfo } from '../common/models';
import { Store } from './Store';

export class GameInfosStore extends Store<GameInfo> {
  constructor() {
    super();
  }
}

export const gameInfosStore = new GameInfosStore();
