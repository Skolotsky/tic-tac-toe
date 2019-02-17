import { GamesStore } from '../../stores/GamesStore';
import { WebSocketService } from '../WebSocketService';
import { Game } from '@common/models';
import { SyncService } from '../SyncService';
import { WebSocketMessageTypes } from '@common/constants/WebSocketMessageTypes';


export class GamesSyncService extends SyncService<Game> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      store,
      webSocketService,
      WebSocketMessageTypes.Game,
      [WebSocketMessageTypes.SubscribeGame, WebSocketMessageTypes.UnsubscribeGame]
    );
  }
}
