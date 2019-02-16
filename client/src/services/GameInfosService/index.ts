import { webSocketService, WebSocketService } from '../WebSocketService';
import { GameInfo } from '../../common/models';
import { SyncService } from '../SyncService';
import { gameInfosStore, GameInfosStore } from '../../stores/GameInfosStore';
import { deserializeGameInfo } from '../../common/lib/gameInfo';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME_INFO',
  Unsubscribe = 'UNSUBSCRIBE_GAME_INFO'
}

enum ReceivedWebSocketMessageType {
  Entity = 'GAME_INFO'
}

export class GameInfosService extends SyncService<GameInfo> {
  constructor(
    store: GameInfosStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializeGameInfo,
      SendWebSocketMessageType.Subscribe,
      SendWebSocketMessageType.Unsubscribe,
      ReceivedWebSocketMessageType.Entity
    );
  }
}

export const gameInfosService = new GameInfosService(gameInfosStore, webSocketService);
