import { webSocketService, WebSocketService } from '../WebSocketService';
import { GameGUID, Game, PlayerGUID } from '../../common/models';
import { StoreService } from '../StoreService';
import { gamesStore, GamesStore } from '../../stores/GamesStore';
import { deserializeGame } from '../../lib/game';
import { playerService } from '../PlayerService';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME',
  Unsubscribe = 'UNSUBSCRIBE_GAME'
}

enum ReceivedWebSocketMessageType {
  Entity = 'GAME'
}

export class GamesService extends StoreService<GameGUID, Game> {
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
