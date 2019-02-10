import * as express from 'express';
import * as http from 'http';
import { WebSocketService } from './services/WebSocketService';
import { GameListService } from './services/GameListService';
import { gamesStore } from './stores/GamesStore';
import { GameService } from './services/GameService';
import { PlayerService } from './services/PlayerService';
import { playersStore } from './stores/PlayersStore';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const webSocketService = new WebSocketService(server);
const gameListService = new GameListService(gamesStore, webSocketService);
const gameService = new GameService(gamesStore, webSocketService);
const playerService = new PlayerService(playersStore, webSocketService);

//start our server
server.listen(process.env.PORT || 8999, () => {
  const address = server.address();
  if (typeof address === 'string') {
    console.log(`Server started on ${address} :)`);
  } else {
    console.log(`Server started on port ${address.port} :)`);
  }
});
