import { ConnectionId, WebSocketMessage, WebSocketMessageType, WebSocketService } from '../WebSocketService';
import { autorun, IReactionDisposer } from 'mobx';
import { EntityProvider } from '@common/store';
import { Entity } from '@common/types';

export class SyncService<TEntity extends Entity<unknown>> {
  private disposers = new Map<ConnectionId, Map<TEntity['id'], IReactionDisposer>>();

  constructor(
    private store: EntityProvider<TEntity>,
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
    console.log('subscribe', connectionId);
    let disposers = this.disposers.get(connectionId);
    if (!disposers) {
      disposers = new Map<TEntity['id'], IReactionDisposer>();
      this.disposers.set(connectionId, disposers);
    }
    const ids = JSON.parse(message.data!) as TEntity['id'][];
    ids.forEach(id => {
      disposers!.set(
        id,
        autorun(() => this.send(id, [connectionId]))
      );
    });
  };

  private onUnsubscribe = (message: WebSocketMessage, connectionId: ConnectionId) => {
    console.log('unsubscribe', connectionId);
    let disposers = this.disposers.get(connectionId);
    if (disposers) {
      const ids = JSON.parse(message.data!) as TEntity['id'][];
      ids.forEach(id => {
        const disposer = disposers!.get(id);
        if (disposer) {
          disposer();
          disposers!.delete(id);
        }
      });
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

  private send(id: TEntity['id'], connectionIds: ConnectionId[]) {
    console.log('send', id, connectionIds.join(', '));
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
