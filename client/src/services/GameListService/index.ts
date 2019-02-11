import { WebSocketMessage, webSocketService, WebSocketService } from '../WebSocketService';
import { gameListStore, GameListStore } from '../../stores/GameListStore';
import { GameGUID } from '../../common/models';

enum SendWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME_LIST',
  Unsubscribe = 'UNSUBSCRIBE_GAME_LIST'
}

enum ReceivedWebSocketMessageType {
  Entity = 'GAME_LIST'
}

export class GameListService {
  constructor(
    private store: GameListStore,
    private webSocketService: WebSocketService
  ) {
    webSocketService.on(
      ReceivedWebSocketMessageType.Entity,
      this.onReceive
    );
  }

  subscribe() {
    this.webSocketService.send({
      type: SendWebSocketMessageType.Subscribe
    })
  }

  unsubscribe() {
    this.webSocketService.send({
      type: SendWebSocketMessageType.Unsubscribe
    })
  }

  private onReceive = (message: WebSocketMessage) => {
    const ids = JSON.parse(message.data as string) as GameGUID[];
    this.store.set(ids);
  };
}

export const gameListService = new GameListService(gameListStore, webSocketService);
