import { WebSocketService } from '../WebSocketService';
import { GameGUID, GameInfo } from '../../common/models';
import { StoreService } from '../StoreService';
import { GameInfosStore } from '../../stores/GameInfosStore';
import { deserializeGameInfo } from '../../lib/gameInfo';

enum ReceivedWebSocketMessageType {
  Entity = 'GAME_INFO'
}

export class GameInfoService extends StoreService<GameGUID, GameInfo> {
  constructor(
    store: GameInfosStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializeGameInfo,
      ReceivedWebSocketMessageType.Entity
    );
  }
}
