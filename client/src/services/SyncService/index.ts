import { WebSocketMessage, WebSocketMessageType, WebSocketService } from '../WebSocketService';
import { Entity } from '../../common/types';
import { EntityConsumer } from '../../common/store';

export class SyncService<TEntity extends Entity<unknown>> {
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
  }

  subscribe(ids: TEntity['id'][]) {
    if (!ids.length) {
      return;
    }
    this.webSocketService.send({
      type: this.subscribeMessageType,
      data: JSON.stringify(ids)
    })
  }

  unsubscribe(ids: TEntity['id'][]) {
    if (!ids.length) {
      return;
    }
    this.webSocketService.send({
      type: this.unsubscribeMessageType,
      data: JSON.stringify(ids)
    })
  }

  private onReceive = (message: WebSocketMessage) => {
    const entity = this.deserialize(message.data as string);
    if (entity) {
      this.store.set(entity.id, entity);
    }
  };
}
