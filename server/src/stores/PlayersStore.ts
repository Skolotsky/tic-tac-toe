import { Player, PlayerGUID } from '../common/models';
import { player } from '../mocks';
import { Store } from './Store';

export class PlayersStore extends Store<PlayerGUID, Player> {
  constructor() {
    super();
    this.entitiesMap.set(player.id, player);
  }
}

export const playersStore = new PlayersStore();
