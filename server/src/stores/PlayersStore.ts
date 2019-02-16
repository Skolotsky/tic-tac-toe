import { Player, PlayerGUID } from '@common/models';
import { Store } from './Store';

export class PlayersStore extends Store<PlayerGUID, Player> {
  constructor() {
    super();
  }
}

export const playersStore = new PlayersStore();
