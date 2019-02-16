import { PlayersStore } from '../../stores/PlayersStore';
import { WebSocketService } from '../WebSocketService';
import { Player, PlayerGUID } from '@common/models';
import { StoreService } from '../StoreService';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_PLAYER',
  Unsubscribe = 'UNSUBSCRIBE_PLAYER'
}

enum SendWebSocketMessageType {
  Entity = 'PLAYER'
}

export class PlayersService extends StoreService<PlayerGUID, Player> {
  constructor(
    store: PlayersStore,
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
