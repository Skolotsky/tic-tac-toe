import { webSocketService, WebSocketService } from '../WebSocketService';
import { Game } from '../../common/models';
import { SyncService } from '../SyncService';
import { gamesStore, GamesStore } from '../../stores/GamesStore';
import { deserializeGame } from '../../common/lib/game';
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
}

export const gamesSyncService = new GamesSyncService(gamesStore, webSocketService);
