import { WebSocketMessage, webSocketService, WebSocketService } from '../WebSocketService';
import { gameListStore, GameListStore } from '../../stores/GameListStore';
import { GameGUID } from '../../common/models';
import { WebSocketMessageTypes } from '../../common/constants/WebSocketMessageTypes';

export class GameListSyncService {
  constructor(
    private store: GameListStore,
    private webSocketService: WebSocketService
  ) {
    webSocketService.on(
      WebSocketMessageTypes.GameList,
      this.onReceive
    );
  }

  subscribe() {
    this.webSocketService.send({
      type: WebSocketMessageTypes.SubscribeGameList
    })
  }

  unsubscribe() {
    this.webSocketService.send({
      type: WebSocketMessageTypes.UnsubscribeGameList
    })
  }

  private onReceive = (message: WebSocketMessage) => {
    const ids = JSON.parse(message.data as string) as GameGUID[];
    this.store.set(ids);
  };
}

export const gameListSyncService = new GameListSyncService(gameListStore, webSocketService);
