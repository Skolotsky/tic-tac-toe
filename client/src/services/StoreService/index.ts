import { WebSocketMessage, WebSocketMessageType, WebSocketService } from '../WebSocketService';
import { Store } from '../../stores/Store';

export class StoreService<ID extends string, T extends { id: ID }> {
  constructor(
    private store: Store<ID, T>,
    private webSocketService: WebSocketService,
    private deserialize: (data: string) => T,
    private receiveMessageType: WebSocketMessageType
  ) {
    webSocketService.on(
      receiveMessageType,
      this.onReceive
    );
  }

  private onReceive = (message: WebSocketMessage) => {
    const entity = this.deserialize(message.data as string);
    this.store.set(entity.id, entity);
  };
}
