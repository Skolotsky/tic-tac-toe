import { webSocketService, WebSocketService } from '../WebSocketService';
import { GameGUID, Game } from '../../common/models';
import { SyncService } from '../SyncService';
import { gamesStore, GamesStore } from '../../stores/GamesStore';
import { deserializeGame } from '../../common/lib/game';
import { playerService } from '../PlayerService';
import { WebSocketMessageTypes } from '../../common/constants/WebSocketMessageTypes';

export class GamesSyncService extends SyncService<Game> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializeGame,
      WebSocketMessageTypes.SubscribeGame,
      WebSocketMessageTypes.UnsubscribeGame,
      WebSocketMessageTypes.Game
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
