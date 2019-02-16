import { Game, GameGUID, PlayerGUID } from '@common/models';
import { emptyField } from '@common/models-constants';

export const game: Game<PlayerGUID> = {
  id: 'g123' as GameGUID,
  createDate: new Date(),
  players: [],
  lastAction: null,
  field: emptyField
};
