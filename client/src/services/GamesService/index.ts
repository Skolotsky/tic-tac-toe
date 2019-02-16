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

export class GamesService extends SyncService<Game> {
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

  joinGame(gameId: GameGUID) {
    const playerId = playerService.self();
    if (playerId) {
      return fetch(`/api/game/${ gameId.replace(/-/g, '_') }/join/${ playerId.replace(/-/g, '_') }`, {
        method: 'POST'
      });
    }
  }

  async newGame(): Promise<GameGUID | null> {
    const playerId = playerService.self();
    if (playerId) {
      const response = await fetch(`/api/game/new/`, {
        method: 'POST'
      });
      const body = await response.json();
      return body.id || null;
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

export const gamesService = new GamesService(gamesStore, webSocketService);
