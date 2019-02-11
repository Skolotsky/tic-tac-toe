import { GamesStore } from '../../stores/GamesStore';
import { WebSocketService } from '../WebSocketService';
import { Game, GameGUID } from '../../common/models';
import { StoreService } from '../StoreService';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME',
  Unsubscribe = 'UNSUBSCRIBE_GAME'
}

enum SendWebSocketMessageType {
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
      SendWebSocketMessageType.Entity,
      [ReceivedWebSocketMessageType.Subscribe, ReceivedWebSocketMessageType.Unsubscribe]
    );
  }
}
