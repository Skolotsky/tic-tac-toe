import { WebSocketMessage, WebSocketMessageType, WebSocketService } from '../WebSocketService';
import { Store } from '../../stores/Store';

export class StoreService<ID extends string, T extends { id: ID }> {
  constructor(
    private store: Store<ID, T>,
    private webSocketService: WebSocketService,
    private deserialize: (data: string) => T,
    private subscribeMessageType: WebSocketMessageType,
    private unsubscribeMessageType: WebSocketMessageType,
    receiveMessageType: WebSocketMessageType
  ) {
    webSocketService.on(
      receiveMessageType,
      this.onReceive
    );
  }

  subscribe(ids: ID[]) {
    if (!ids.length) {
      return;
    }
    this.webSocketService.send({
      type: this.subscribeMessageType,
      data: JSON.stringify(ids)
    })
  }

  unsubscribe(ids: ID[]) {
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
