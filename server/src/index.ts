import 'module-alias/register';
import * as express from 'express';
import * as http from 'http';
import { WebSocketService } from './services/WebSocketService';
import { GameListSyncService } from './services/GameListSyncService';
import { gamesStore } from './stores/GamesStore';
import { GamesSyncService } from './services/GamesSyncService';
import { PlayersSyncService } from './services/PlayersSyncService';
import { playersStore } from './stores/PlayersStore';
import { GameInfosSyncService } from './services/GameInfosSyncService';
import { GamesService } from './services/GamesService';
import { PlayersService } from './services/PlayersService';

const app = express();
app.use(express.json());

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const webSocketService = new WebSocketService(server);
const gameListSyncService = new GameListSyncService(gamesStore, webSocketService);
const gameInfosSyncService = new GameInfosSyncService(gamesStore, webSocketService);
const gamesSyncService = new GamesSyncService(gamesStore, webSocketService);
const playersSyncService = new PlayersSyncService(playersStore, webSocketService);
const gamesService = new GamesService(gamesStore, playersStore, app);
const playersService = new PlayersService(playersStore, app);

//start our server
server.listen(process.env.PORT || 8999, () => {
  const address = server.address();
  if (typeof address === 'string') {
    console.log(`Server started on ${address}`);
  } else if (address) {
    console.log(`Server started on port ${address.port}`);
  }
});
