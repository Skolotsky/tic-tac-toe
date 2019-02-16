import { GamesStore } from '../../stores/GamesStore';
import { WebSocketService } from '../WebSocketService';
import { GameGUID, GameInfo } from '@common/models';
import { SyncService } from '../SyncService';
import { getGameInfo } from '@common/lib/gameInfo';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME_INFO',
  Unsubscribe = 'UNSUBSCRIBE_GAME_INFO'
}

enum SendWebSocketMessageType {
  Entity = 'GAME_INFO'
}

export class GameInfosSyncService extends SyncService<GameInfo> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      { get: (id: GameGUID) => getGameInfo(store, id) },
      webSocketService,
      SendWebSocketMessageType.Entity,
      [ReceivedWebSocketMessageType.Subscribe, ReceivedWebSocketMessageType.Unsubscribe]
    );
  }
}
