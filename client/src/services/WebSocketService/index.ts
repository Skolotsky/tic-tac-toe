import { URLString } from '../../common/types';
import { action, computed, observable, when } from 'mobx';
import { WebSocketMessageTypes } from '../../common/constants/WebSocketMessageTypes';

enum WebSocketServiceState {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export type WebSocketMessageType = string;

export interface WebSocketMessage {
  type: WebSocketMessageType,
  data?: string
}

type Handler = (message: WebSocketMessage) => void

const serializeWebSocketMessage = (message: WebSocketMessage): string => JSON.stringify(message);

export class WebSocketService {
  @observable
  private socket: WebSocket | null = null;
  @observable
  private state: WebSocketServiceState = WebSocketServiceState.DISCONNECTED;
  private handlers = new Map<WebSocketMessageType, Set<Handler>>();

  constructor(private url: URLString) {
    when(
      () => this.state === WebSocketServiceState.DISCONNECTED,
      this.connect
    );
    this.on(WebSocketMessageTypes.Ping, this.pong);
  }

  @computed
  get isConnected(): boolean {
    return this.state === WebSocketServiceState.CONNECTED;
  }

  send(message: WebSocketMessage) {
    if (this.socket) {
      this.socket.send(serializeWebSocketMessage(message));
    } else {
      console.error(`Can't send message: WebSocket is not connected`);
    }
  }

  on(type: string, handler: Handler) {
    let handlers = this.handlers.get(type);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(type, handlers);
    }
    handlers.add(handler);
  }

  private pong = () => {
    this.send({
      type: WebSocketMessageTypes.Pong
    })
  };

  @action
  private onOpen = () => {
    this.state = WebSocketServiceState.CONNECTED;
  };

  @action
  private onClose = () => {
    this.state = WebSocketServiceState.DISCONNECTED;
  };

  @action
  private onError = () => {
    this.state = WebSocketServiceState.DISCONNECTED;
  };

  @action
  private onMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data) as WebSocketMessage;
    let handlers = this.handlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }
  };

  @action
  private connect = () => {
    if (this.socket) {
      this.socket.close()
    }
    this.state = WebSocketServiceState.CONNECTING;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
    this.socket.onmessage = this.onMessage;
  };
}

export const webSocketService = new WebSocketService(`ws://${ window.location.host }/ws` as URLString);
