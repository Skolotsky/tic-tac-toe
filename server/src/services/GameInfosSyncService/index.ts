import { GamesStore } from '../../stores/GamesStore';
import { WebSocketService } from '../WebSocketService';
import { GameGUID, GameInfo } from '@common/models';
import { SyncService } from '../SyncService';
import { getGameInfo } from '@common/lib/gameInfo';
import { WebSocketMessageTypes } from '@common/constants/WebSocketMessageTypes';

export class GameInfosSyncService extends SyncService<GameInfo> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      { get: (id: GameGUID) => getGameInfo(store, id) },
      webSocketService,
      WebSocketMessageTypes.GameInfo,
      [WebSocketMessageTypes.SubscribeGameInfo, WebSocketMessageTypes.UnsubscribeGameInfo]
    );
  }
}
