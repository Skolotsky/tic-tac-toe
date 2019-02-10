import { ConnectionId, WebSocketMessage, WebSocketMessageType, WebSocketService } from '../WebSocketService';
import { autorun, IReactionDisposer } from 'mobx';
import { IStore } from '../../stores/Store';

export class StoreService<ID extends string, T> {
  private disposers = new Map<ConnectionId, Map<ID, IReactionDisposer>>();

  constructor(
    private store: IStore<ID, T>,
    private webSocketService: WebSocketService,
    private sendMessageType: WebSocketMessageType,
    [subscribeMessageType, unsubscribeMessageType]: [WebSocketMessageType, WebSocketMessageType]
  ) {
    webSocketService.on(
      subscribeMessageType,
      this.onSubscribe
    );
    webSocketService.on(
      unsubscribeMessageType,
      this.onUnsubscribe
    );
    webSocketService.on(
      WebSocketService.REMOVE,
      this.onUnsubscribeAll
    );
  }

  private onSubscribe = (message: WebSocketMessage, connectionId: ConnectionId) => {
    let disposers = this.disposers.get(connectionId);
    if (!disposers) {
      disposers = new Map<ID, IReactionDisposer>();
      this.disposers.set(connectionId, disposers);
    }
    const game = message.data as ID;
    disposers.set(
      game,
      autorun(() => this.send(game, [connectionId]))
    );
  };

  private onUnsubscribe = (message: WebSocketMessage, connectionId: ConnectionId) => {
    let disposers = this.disposers.get(connectionId);
    if (disposers) {
      const entity = message.data as ID;
      const disposer = disposers.get(entity);
      if (disposer) {
        disposer();
        disposers.delete(entity);
      }
    }
  };

  private onUnsubscribeAll = (message: WebSocketMessage, connectionId: ConnectionId) => {
    let disposers = this.disposers.get(connectionId);
    if (disposers) {
      disposers.forEach(disposer => {
        disposer();
      });
      this.disposers.delete(connectionId);
    }
  };

  private send(id: ID, connectionIds: ConnectionId[]) {
    const entity = this.store.get(id);
    this.webSocketService.send(
      {
        type: this.sendMessageType,
        data: JSON.stringify(entity)
      },
      connectionIds
    );
  }
}
