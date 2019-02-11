import { webSocketService, WebSocketService } from '../WebSocketService';
import { PlayerGUID, Player } from '../../common/models';
import { StoreService } from '../StoreService';
import { playersStore, PlayersStore } from '../../stores/PlayersStore';
import { deserializePlayer } from '../../lib/player';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_PLAYER',
  Unsubscribe = 'UNSUBSCRIBE_PLAYER'
}

enum ReceivedWebSocketMessageType {
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
      deserializePlayer,
      SendWebSocketMessageType.Subscribe,
      SendWebSocketMessageType.Unsubscribe,
      ReceivedWebSocketMessageType.Entity
    );
  }
}

export const playersService = new PlayersService(playersStore, webSocketService);
