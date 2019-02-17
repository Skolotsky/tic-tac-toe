import { GamesStore } from '../../stores/GamesStore';
import { ConnectionId, WebSocketMessage, WebSocketService } from '../WebSocketService';
import { autorun, IReactionDisposer } from 'mobx';
import { WebSocketMessageTypes } from '@common/constants/WebSocketMessageTypes';

export class GameListSyncService {
  private disposers = new Map<ConnectionId, IReactionDisposer>();

  constructor(
    private store: GamesStore,
    private webSocketService: WebSocketService
  ) {
    webSocketService.on(
      WebSocketMessageTypes.SubscribeGameList,
      this.onSubscribe
    );
    webSocketService.on(
      WebSocketMessageTypes.UnsubscribeGameList,
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
        type: WebSocketMessageTypes.GameList,
        data: JSON.stringify(this.store.allIds)
      },
      connectionIds
    );
  }
}
