import * as express from 'express';
import { PlayerGUID } from '@common/models';
import { PlayersStore } from '../../stores/PlayersStore';
import { createPlayer } from '@common/lib/player';
import * as uuidv1 from 'uuid/v1';

export class PlayersService {
  constructor(
    private playersStore: PlayersStore,
    private app: express.Express
  ) {
    app.post('/api/player', this.onPlayerJoined);
  }

  private onPlayerJoined = (req: express.Request, res: express.Response) => {
    let id = req.body.requestedId as PlayerGUID | null;
    if (!id || !this.playersStore.get(id)) {
      const player = createPlayer(uuidv1() as PlayerGUID);
      this.playersStore.set(player.id, player);
      id = player.id;
    }
    console.log('player joined', id);
    res.json({ id });
  };
}
