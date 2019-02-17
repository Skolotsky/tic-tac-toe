import { PlayerGUID } from '../../common/models';
import { action, autorun, observable } from 'mobx';
import { PlayersSyncService, playersSyncService } from '../PlayersSyncService';
import { WebSocketService, webSocketService } from '../WebSocketService';

export class PlayerService {
  @observable
  private id: PlayerGUID | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private playersSyncService: PlayersSyncService
  ) {
    autorun(() => {
      if (this.webSocketService.isConnected) {
        this.fetchId();
      }
    });
    autorun(() => {
      if (this.webSocketService.isConnected && this.id) {
        this.playersSyncService.subscribe([this.id]);
      }
    });
  }

  self(): PlayerGUID | null {
    return this.id;
  }

  private async fetchId() {
    const lastId = localStorage.getItem('playerId') as PlayerGUID | null;
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

export const playerService = new PlayerService(webSocketService, playersSyncService);
