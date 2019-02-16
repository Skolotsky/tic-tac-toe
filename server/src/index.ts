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
import { GameGUID, PlayerGUID } from '@common/models';
import { action } from 'mobx';
import { fillFieldCell } from '@common/lib/rules';
import { createGame } from '@common/lib/game';
const uuidv1 = require('uuid/v1');

const app = express();
app.use(express.json());

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const webSocketService = new WebSocketService(server);
const gameListService = new GameListSyncService(gamesStore, webSocketService);
const gameInfosService = new GameInfosSyncService(gamesStore, webSocketService);
const gamesService = new GamesSyncService(gamesStore, webSocketService);
const playersService = new PlayersSyncService(playersStore, webSocketService);

//start our server
server.listen(process.env.PORT || 8999, () => {
  const address = server.address();
  if (typeof address === 'string') {
    console.log(`Server started on ${address}`);
  } else {
    console.log(`Server started on port ${address.port}`);
  }
});

app.post('/api/player', function (req: express.Request, res: express.Response) {
  const requestedId = req.body.requestedId as PlayerGUID | null;
  const id = requestedId || uuidv1() as PlayerGUID;
  console.log('player joined', id);
  playersStore.set(id, { id });

  res.json({ id });
});

app.post('/api/game/:gameId/join/:playerId', function (req: express.Request, res: express.Response) {
  const gameId = req.params.gameId.replace(/_/g, '-') as GameGUID;
  const playerId = req.params.playerId.replace(/_/g, '-') as PlayerGUID;
  const game = gamesStore.get(gameId);
  if (!game) {
    res.statusCode = 404;
    res.send('game not found');
    return
  }
  const player = playersStore.get(playerId);
  if (!player) {
    res.statusCode = 404;
    res.send('player not found');
    return
  }
  if (!game.players.includes(playerId)) {
    action(() => {
      game.players.push(playerId)
    })();
  }
  res.send();
});

app.post('/api/game/new', function (req: express.Request, res: express.Response) {
  const game = createGame();
  gamesStore.set(game.id, game);
  res.json({ id: game.id });
});

app.post('/api/game/:gameId/turn/', function (req: express.Request, res: express.Response) {
  const gameId = req.params.gameId.replace(/_/g, '-') as GameGUID;
  const game = gamesStore.get(gameId);
  if (!game) {
    res.statusCode = 404;
    res.send('game not found');
    return
  }
  const playerId = req.body.playerId as PlayerGUID;
  const rowIndex = req.body.rowIndex as number;
  const columnIndex = req.body.columnIndex as number;
  action(() => {
    fillFieldCell(playerId, game, rowIndex, columnIndex);
  })();
  res.send();
});
