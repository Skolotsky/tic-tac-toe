import * as WebSocket from 'ws';
import * as http from 'http';
import { EventEmitter } from 'events';
import { WebSocketMessageType } from '../../../../client/src/services/WebSocketService';

export type WebSocketMessageType = string;

export interface WebSocketMessage {
  type: WebSocketMessageType,
  data?: string
}

type Handler = (message: WebSocketMessage, connectionId: ConnectionId) => void
export type ConnectionId = number;

export enum WebSocketMessageTypes {
  Ping = 'PING',
  Pong = 'PONG'
}
export const PING_INTERVAL = 2000;
export const PONG_AWAIT = 1000;

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
    setInterval(this.ping, PING_INTERVAL);
  }

  send(message: WebSocketMessage, connectionIds?: ConnectionId[]): ConnectionId[] {
    if (connectionIds) {
      connectionIds.forEach(connectionId => {
        const ws = this.connections.get(connectionId);
        if (ws) {
          this.sendToWs(ws, message);
        }
      });
      return connectionIds;
    } else {
      connectionIds = [] as ConnectionId[];
      this.connections.forEach((ws, connectionId) => {
        connectionIds!.push(connectionId);
        this.sendToWs(ws, message);
      });
      return connectionIds;
    }
  }

  on(type: WebSocketMessageType | typeof WebSocketService.REMOVE, handler: Handler) {
    return this.eventEmitter.on(type, handler)
  }

  removeListener(type: WebSocketMessageType | typeof WebSocketService.REMOVE, handler: Handler) {
    return this.eventEmitter.removeListener(type, handler)
  }

  private ping = () => {
    const connectionIds = this.send({
      type: WebSocketMessageTypes.Ping
    });
    const aliveConnections: Set<ConnectionId> = new Set();
    const pongHandler: Handler = (_, connectionId) => {
      aliveConnections.add(connectionId);
    };
    this.on(WebSocketMessageTypes.Pong, pongHandler);
    setTimeout(
      () => {
        this.removeListener(WebSocketMessageTypes.Pong, pongHandler);
        connectionIds.forEach(connectionId => {
          if (!aliveConnections.has(connectionId)) {
            const ws = this.connections.get(connectionId);
            if (ws) {
              this.onClose(ws);
            }
          }
        });
      },
      PONG_AWAIT
    )
  };

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
    if (connectionId !== null) {
      this.eventEmitter.emit(message.type, message, connectionId);
    }
  };

  private onConnection = (ws: WebSocket) => {
    console.log('connected', this.lastConnectionId);
    this.connections.set(this.lastConnectionId++, ws);
    ws.on('message', (data) => {
      if (typeof data === 'string') {
        this.onMessage(ws, data);
      }
    });
  };

  private onClose = (ws: WebSocket) => {
    ws.close();
    let connectionId = this.getConnectionId(ws);
    if (connectionId !== null) {
      this.connections.delete(connectionId);
      this.eventEmitter.emit(WebSocketService.REMOVE, { type: '' }, connectionId);
      console.log('disconnected', connectionId);
    }
  };

  private onError = this.onClose;
}
