import { PlayerGUID } from '../../common/models';
import { action, autorun, observable } from 'mobx';
import { playersSyncService } from '../PlayersSyncService';
import { webSocketService } from '../WebSocketService';

export class PlayerService {
  @observable
  private id: PlayerGUID | null = null;

  constructor() {
    const id = localStorage.getItem('playerId') as PlayerGUID | null;
    this.fetchId(id);
    autorun(() => {
      if (webSocketService.isConnected && this.id) {
        playersSyncService.subscribe([this.id]);
      }
    })
  }

  self(): PlayerGUID | null {
    return this.id;
  }

  private async fetchId(lastId: PlayerGUID | null) {
    const response = await fetch('/api/player', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body:  JSON.stringify({
        requestedId: lastId
      })
    });
    if (response.status === 200) {
      const { id } = await response.json();
      if (id) {
        this.setId(id as PlayerGUID);
      }
    }
  }

  @action
  private setId(id: PlayerGUID) {
    this.id = id;
    localStorage.setItem('playerId', id);
  }
}

export const playerService = new PlayerService();
