import { Player } from '../common/models';
import { Store } from './Store';

export class PlayersStore extends Store<Player> {
  constructor() {
    super();
  }
}

export const playersStore = new PlayersStore();
