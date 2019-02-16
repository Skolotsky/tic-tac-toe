import { webSocketService, WebSocketService } from '../WebSocketService';
import { GameGUID, GameInfo } from '../../common/models';
import { StoreService } from '../StoreService';
import { gameInfosStore, GameInfosStore } from '../../stores/GameInfosStore';
import { deserializeGameInfo } from '../../common/lib/gameInfo';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME_INFO',
  Unsubscribe = 'UNSUBSCRIBE_GAME_INFO'
}

enum ReceivedWebSocketMessageType {
  Entity = 'GAME_INFO'
}

export class GameInfosService extends StoreService<GameGUID, GameInfo> {
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
