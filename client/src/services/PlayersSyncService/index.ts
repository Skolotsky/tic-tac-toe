import { webSocketService, WebSocketService } from '../WebSocketService';
import { Player } from '../../common/models';
import { SyncService } from '../SyncService';
import { playersStore, PlayersStore } from '../../stores/PlayersStore';
import { deserializePlayer } from '../../common/lib/player';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_PLAYER',
  Unsubscribe = 'UNSUBSCRIBE_PLAYER'
}

enum ReceivedWebSocketMessageType {
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
      deserializePlayer,
      SendWebSocketMessageType.Subscribe,
      SendWebSocketMessageType.Unsubscribe,
      ReceivedWebSocketMessageType.Entity
    );
  }
}

export const playersSyncService = new PlayersSyncService(playersStore, webSocketService);
