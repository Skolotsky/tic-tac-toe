import * as WebSocket from 'ws';
import * as http from 'http';
import { EventEmitter } from 'events';

export type WebSocketMessageType = string;

export interface WebSocketMessage {
  type: WebSocketMessageType,
  data?: string
}

type Handler = (message: WebSocketMessage, connectionId: ConnectionId) => void
export type ConnectionId = number;

const serializeWebSocketMessage = (message: WebSocketMessage): string => JSON.stringify(message);

export class WebSocketService {
  static REMOVE = Symbol('Remove');
  private server:  WebSocket.Server;
  private lastConnectionId: ConnectionId = 0;
  private connections = new Map<ConnectionId, WebSocket>();
  private eventEmitter = new EventEmitter();

  constructor(server: http.Server) {
    this.server = new WebSocket.Server({ server });
    this.server.on('connection', this.onConnection);
    this.server.on('error', this.onError);
    this.server.on('close', this.onClose);
  }

  send(message: WebSocketMessage, connectionIds?: ConnectionId[]) {
    if (connectionIds) {
      connectionIds.forEach(connectionId => {
        const ws = this.connections.get(connectionId);
        if (ws) {
          this.sendToWs(ws, message);
        }
      });
    } else {
      this.connections.forEach(ws => {
        this.sendToWs(ws, message);
      });
    }
  }

  on(type: WebSocketMessageType | typeof WebSocketService.REMOVE, handler: Handler) {
    return this.eventEmitter.on(type, handler)
  }

  private sendToWs(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(serializeWebSocketMessage(message));
    } else {
      this.onClose(ws);
    }
  }

  private getConnectionId(source: WebSocket): ConnectionId | null {
    let sourcePlayer: ConnectionId | null = null;
    this.connections.forEach((ws, player) => {
      if (ws === source) {
        sourcePlayer = player;
      }
    });
    return sourcePlayer;
  }

  private onMessage = (ws: WebSocket, data: string) => {
    const message = JSON.parse(data) as WebSocketMessage;
    let connectionId = this.getConnectionId(ws);
    if (connectionId) {
      this.eventEmitter.emit(message.type, message, connectionId);
    }
  };

  private onConnection = (ws: WebSocket) => {
    this.connections.set(this.lastConnectionId++, ws);
    ws.on('message', (data) => {
      if (typeof data === 'string') {
        this.onMessage(ws, data);
      }
    });
  };

  private onClose = (source: WebSocket) => {
    source.close();
    let connectionId = this.getConnectionId(source);
    if (connectionId) {
      this.connections.delete(connectionId);
      this.eventEmitter.emit(WebSocketService.REMOVE, { type: '' }, connectionId);
    }
  };

  private onError = this.onClose;
}
