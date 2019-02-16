import { PlayerGUID } from '../../common/models';
import { action, autorun, observable } from 'mobx';
import { playersService } from '../PlayersService';
import { webSocketService } from '../WebSocketService';

export class PlayerService {
  @observable
  private id: PlayerGUID | null = null;

  constructor() {
    const id = localStorage.getItem('playerId') as PlayerGUID | null;
    this.fetchId(id);
    autorun(() => {
      if (webSocketService.isConnected && this.id) {
        playersService.subscribe([this.id]);
      }
    })
  }

  self(): PlayerGUID | null {
    return this.id;
  }

  private async fetchId(id: PlayerGUID | null) {
    const response = await fetch('/api/player', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body:  JSON.stringify({
        requestedId: id
      })
    });
    if (response.status === 200) {
      const { id } = await response.json();
      if (id) {
        this.setId(id as PlayerGUID);
        localStorage.setItem('playerId', id);
      }
    }
  }

  @action
  private setId(id: PlayerGUID) {
    this.id = id;
  }
}

export const playerService = new PlayerService();
