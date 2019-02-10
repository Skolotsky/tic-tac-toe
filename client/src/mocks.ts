import { Game, GameGUID, Player, PlayerGUID } from './common/models';
import { emptyField } from './common/models-constants';

export const player: Player = {
  id: 'p123' as PlayerGUID
};

export const game: Game<PlayerGUID> = {
  id: 'g123' as GameGUID,
  createDate: new Date(),
  players: [player.id],
  lastAction: null,
  field: emptyField
};
