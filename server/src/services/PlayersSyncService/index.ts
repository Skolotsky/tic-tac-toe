import { PlayersStore } from '../../stores/PlayersStore';
import { WebSocketService } from '../WebSocketService';
import { Player } from '@common/models';
import { SyncService } from '../SyncService';
import { WebSocketMessageTypes } from '@common/constants/WebSocketMessageTypes';

export class PlayersSyncService extends SyncService<Player> {
  constructor(
    store: PlayersStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      WebSocketMessageTypes.Player,
      [WebSocketMessageTypes.SubscribePlayer, WebSocketMessageTypes.UnsubscribePlayer]
    );
  }
}
