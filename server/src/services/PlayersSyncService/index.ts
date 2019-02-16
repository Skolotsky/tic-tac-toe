import { PlayersStore } from '../../stores/PlayersStore';
import { WebSocketService } from '../WebSocketService';
import { Player } from '@common/models';
import { SyncService } from '../SyncService';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_PLAYER',
  Unsubscribe = 'UNSUBSCRIBE_PLAYER'
}

enum SendWebSocketMessageType {
  Entity = 'PLAYER'
}

export class PlayersSyncService extends SyncService<Player> {
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
