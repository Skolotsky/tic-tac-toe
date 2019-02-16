import { webSocketService, WebSocketService } from '../WebSocketService';
import { GameGUID, Game } from '../../common/models';
import { SyncService } from '../SyncService';
import { gamesStore, GamesStore } from '../../stores/GamesStore';
import { deserializeGame } from '../../common/lib/game';
import { playerService } from '../PlayerService';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME',
  Unsubscribe = 'UNSUBSCRIBE_GAME'
}

enum ReceivedWebSocketMessageType {
  Entity = 'GAME'
}

export class GamesSyncService extends SyncService<Game> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializeGame,
      SendWebSocketMessageType.Subscribe,
      SendWebSocketMessageType.Unsubscribe,
      ReceivedWebSocketMessageType.Entity
    );
  }

  async joinGame(gameId: GameGUID) {
    const playerId = playerService.self();
    if (playerId) {
      const response = await fetch(`/api/game/${ gameId.replace(/-/g, '_') }/join/${ playerId.replace(/-/g, '_') }`, {
        method: 'POST'
      });
      return response.ok;
    }
    return false;
  }

  async newGame() {
    const playerId = playerService.self();
    if (playerId) {
      const response = await fetch(`/api/game/new/`, {
        method: 'POST'
      });
      if (response.ok) {
        const body = await response.json();
        return body.id as (GameGUID | null) || null;
      }
    }
    return null;
  }

  fillFieldCell(gameId: GameGUID, rowIndex: number, columnIndex: number) {
    const playerId = playerService.self();
    if (playerId) {
      return fetch(`/api/game/${ gameId.replace(/-/g, '_') }/turn/`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          playerId,
          rowIndex,
          columnIndex
        })
      });
    }
  }
}

export const gamesSyncService = new GamesSyncService(gamesStore, webSocketService);
