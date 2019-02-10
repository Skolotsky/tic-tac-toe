import { WebSocketService } from '../WebSocketService';
import { GameGUID, Game } from '../../common/models';
import { StoreService } from '../StoreService';
import { GamesStore } from '../../stores/GamesStore';
import { deserializeGame } from '../../lib/game';

enum ReceivedWebSocketMessageType {
  Entity = 'GAME'
}

export class GameInfoService extends StoreService<GameGUID, Game> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializeGame,
      ReceivedWebSocketMessageType.Entity
    );
  }
}
