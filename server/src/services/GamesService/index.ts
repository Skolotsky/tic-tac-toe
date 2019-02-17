import { GamesStore } from '../../stores/GamesStore';
import * as express from 'express';
import { GameGUID, PlayerGUID } from '@common/models';
import { PlayersStore } from '../../stores/PlayersStore';
import { action } from 'mobx';
import { createGame } from '@common/lib/game';
import { fillFieldCell, joinGame } from '@common/lib/rules';

export class GamesService {
  constructor(
    private gamesStore: GamesStore,
    private playersStore: PlayersStore,
    private app: express.Express
  ) {
    app.post('/api/game/:gameId/join/:playerId', this.onJoinGame);
    app.post('/api/game/new', this.onNewGame);
    app.post('/api/game/:gameId/turn/', this.onGameTurn);
  }

  @action
  private onJoinGame = (req: express.Request, res: express.Response) => {
    const gameId = req.params.gameId.replace(/_/g, '-') as GameGUID;
    const playerId = req.params.playerId.replace(/_/g, '-') as PlayerGUID;
    const game = this.gamesStore.get(gameId);
    if (!game) {
      res.statusCode = 404;
      res.send('game not found');
      return
    }
    const player = this.playersStore.get(playerId);
    if (!player) {
      res.statusCode = 404;
      res.send('player not found');
      return
    }
    joinGame(game, playerId);
    res.send();
  };

  @action
  private onNewGame = (req: express.Request, res: express.Response) =>{
    const game = createGame();
    this.gamesStore.set(game.id, game);
    res.json({ id: game.id });
  };

  @action
  private onGameTurn = (req: express.Request, res: express.Response) => {
    const gameId = req.params.gameId.replace(/_/g, '-') as GameGUID;
    const game = this.gamesStore.get(gameId);
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
  };
}
