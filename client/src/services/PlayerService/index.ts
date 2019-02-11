import { PlayerGUID } from '../../common/models';
import { action, autorun, observable } from 'mobx';
import { playersService } from '../PlayersService';
import { webSocketService } from '../WebSocketService';

export class PlayersService {
  @observable
  private id: PlayerGUID | null = null;

  constructor() {
    const id = localStorage.getItem('playerId');
    if (id) {
      this.setId(id as PlayerGUID);
    } else {
      this.fetchId();
    }
    autorun(() => {
      if (webSocketService.isConnected && this.id) {
        playersService.subscribe([this.id]);
      }
    })
  }

  self(): PlayerGUID | null {
    return this.id;
  }

  private async fetchId() {
    try {
      const response = await fetch('/api/player');
      if (response.status === 200) {
        const { id } = await response.json();
        if (id) {
          this.setId(id as PlayerGUID);
          localStorage.setItem('playerId', id);
        }
      }
    } catch (e) {
    }
  }

  @action
  private setId(id: PlayerGUID) {
    this.id = id;
  }
}

export const playerService = new PlayersService();
