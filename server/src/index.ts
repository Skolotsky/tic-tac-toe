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
import { createPlayer } from '@common/lib/player';
const uuidv1 = require('uuid/v1');

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
  let id = req.body.requestedId as PlayerGUID | null;
  if (!id || !playersStore.get(id)) {
    const player = createPlayer();
    playersStore.set(player.id, player);
    id = player.id;
  }
  console.log('player joined', id);
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
