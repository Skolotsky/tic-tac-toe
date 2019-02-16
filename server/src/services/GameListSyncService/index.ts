import { GamesStore } from '../../stores/GamesStore';
import { ConnectionId, WebSocketMessage, WebSocketService } from '../WebSocketService';
import { autorun, IReactionDisposer } from 'mobx';

enum ReceivedWebSocketMessageType {
  Subscribe = 'SUBSCRIBE_GAME_LIST',
  Unsubscribe = 'UNSUBSCRIBE_GAME_LIST'
}

enum SendWebSocketMessageType {
  Entity = 'GAME_LIST'
}

export class GameListSyncService {
  private disposers = new Map<ConnectionId, IReactionDisposer>();

  constructor(
    private store: GamesStore,
    private webSocketService: WebSocketService
  ) {
    webSocketService.on(
      ReceivedWebSocketMessageType.Subscribe,
      this.onSubscribe
    );
    webSocketService.on(
      ReceivedWebSocketMessageType.Unsubscribe,
      this.onUnsubscribe
    );
    webSocketService.on(
      WebSocketService.REMOVE,
      this.onUnsubscribe
    );
  }

  private onSubscribe = (message: WebSocketMessage, connectionId: ConnectionId) => {
    this.disposers.set(
      connectionId,
      autorun(() => this.send([connectionId]))
    );
  };

  private onUnsubscribe = (message: WebSocketMessage, connectionId: ConnectionId) => {
    const disposer = this.disposers.get(connectionId);
    if (disposer) {
      disposer();
      this.disposers.delete(connectionId);
    }
  };

  private send(connectionIds: ConnectionId[]) {
    this.webSocketService.send(
      {
        type: SendWebSocketMessageType.Entity,
        data: JSON.stringify(this.store.allIds)
      },
      connectionIds
    );
  }
}
