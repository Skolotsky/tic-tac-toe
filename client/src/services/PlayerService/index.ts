import { WebSocketService } from '../WebSocketService';
import { PlayerGUID, Player } from '../../common/models';
import { StoreService } from '../StoreService';
import { PlayersStore } from '../../stores/PlayersStore';
import { deserializePlayer } from '../../lib/player';

enum ReceivedWebSocketMessageType {
  Entity = 'PLAYER'
}

export class GameInfoService extends StoreService<PlayerGUID, Player> {
  constructor(
    store: PlayersStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      deserializePlayer,
      ReceivedWebSocketMessageType.Entity
    );
  }
}
