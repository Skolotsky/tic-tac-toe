import { GamesStore } from '../../stores/GamesStore';
import { WebSocketService } from '../WebSocketService';
import { Game, GameGUID, GameInfo } from '../../common/models';
import { StoreService } from '../StoreService';
import { IStore } from '../../stores/Store';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME_INFO',
  Unsubscribe = 'UNSUBSCRIBE_GAME_INFO'
}

enum SendWebSocketMessageType {
  Entity = 'GAME_INFO'
}

const getGameInfo = (store: IStore<GameGUID, Game>, id: GameGUID): GameInfo | null => {
  const game = store.get(id);
  if (game) {
    return {
      id,
      lastActionDate: game.lastAction ? game.lastAction.date : game.createDate,
      playersCount: game.players.length
    }
  }
  return null;
};

export class GameInfoService extends StoreService<GameGUID, GameInfo> {
  constructor(
    store: GamesStore,
    webSocketService: WebSocketService
  ) {
    super(
      { get: getGameInfo.bind(undefined, store) },
      webSocketService,
      SendWebSocketMessageType.Entity,
      [ReceivedWebSocketMessageType.Subscribe, ReceivedWebSocketMessageType.Unsubscribe]
    );
  }
}
