import { GamesStore } from '../../stores/GamesStore';
import { WebSocketService } from '../WebSocketService';
import { Game } from '@common/models';
import { SyncService } from '../SyncService';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME',
  Unsubscribe = 'UNSUBSCRIBE_GAME'
}

enum SendWebSocketMessageType {
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
      SendWebSocketMessageType.Entity,
      [ReceivedWebSocketMessageType.Subscribe, ReceivedWebSocketMessageType.Unsubscribe]
    );
  }
}
