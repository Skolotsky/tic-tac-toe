import { WebSocketMessage, WebSocketMessageType, WebSocketService } from '../WebSocketService';
import { Entity } from '../../common/types';
import { EntityConsumer } from '../../common/store';
import { action, autorun, IReactionDisposer } from 'mobx';
import { IdSubscription, IdSubscriptions } from '../../lib/Subscriptions';

export class SyncService<TEntity extends Entity<unknown>> {
  private disposers: IReactionDisposer[] = [];
  private serverSubscribedIds: Set<TEntity['id']> = new Set();
  private subscriptions = new IdSubscriptions<TEntity['id']>();
  constructor(
    private store: EntityConsumer<TEntity>,
    private webSocketService: WebSocketService,
    private deserialize: (data: string) => TEntity,
    private subscribeMessageType: WebSocketMessageType,
    private unsubscribeMessageType: WebSocketMessageType,
    receiveMessageType: WebSocketMessageType
  ) {
    webSocketService.on(
      receiveMessageType,
      this.onReceive
    );
    this.disposers.push(autorun(() => {
      const idsToUnsubscribe = Array.from(this.serverSubscribedIds)
        .filter(id => !this.subscriptions.ids.has(id));
      const idsToSubscribe = Array.from(this.subscriptions.ids)
        .filter(id => !this.serverSubscribedIds.has(id));
      this.serverSubscribedIds = this.subscriptions.ids;
      this.subscribeServer(idsToSubscribe);
      this.unsubscribeServer(idsToUnsubscribe);
    }));
  }

  @action
  dispose() {
    this.disposers.forEach(disposer => disposer());
    this.unsubscribeServer(Array.from(this.subscriptions.ids));
  }

  subscribe(ids: TEntity['id'][]): IdSubscription<TEntity['id']> {
    return this.subscriptions.addSubscription(ids);
  }

  unsubscribe(subscription: IdSubscription<TEntity['id']>) {
    return this.subscriptions.removeSubscription(subscription);
  }

  private subscribeServer(ids: TEntity['id'][]) {
    if (!ids.length) {
      return;
    }
    this.webSocketService.send({
      type: this.subscribeMessageType,
      data: JSON.stringify(ids)
    });
  }

  private unsubscribeServer(ids: TEntity['id'][]) {
    if (!ids.length) {
      return;
    }
    this.webSocketService.send({
      type: this.unsubscribeMessageType,
      data: JSON.stringify(ids)
    });
  }

  private onReceive = (message: WebSocketMessage) => {
    const entity = this.deserialize(message.data as string);
    if (entity) {
      this.store.set(entity.id, entity);
    }
  };
}
