import { webSocketService, WebSocketService } from '../WebSocketService';
import { GameInfo } from '../../common/models';
import { SyncService } from '../SyncService';
import { gameInfosStore, GameInfosStore } from '../../stores/GameInfosStore';
import { deserializeGameInfo } from '../../common/lib/gameInfo';
import { WebSocketMessageTypes } from '../../common/constants/WebSocketMessageTypes';

export class GameInfosSyncService extends SyncService<GameInfo> {
  constructor(
    store: GameInfosStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializeGameInfo,
      WebSocketMessageTypes.SubscribeGameInfo,
      WebSocketMessageTypes.UnsubscribeGameInfo,
      WebSocketMessageTypes.GameInfo
    );
  }
}

export const gameInfosSyncService = new GameInfosSyncService(gameInfosStore, webSocketService);
