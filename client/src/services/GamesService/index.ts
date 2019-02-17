import { GameGUID } from '../../common/models';
import { PlayerService, playerService } from '../PlayerService';

export class GamesService {

  constructor(
    private playerService: PlayerService
  ) {
  }

  async joinGame(gameId: GameGUID) {
    const playerId = this.playerService.self();
    if (playerId) {
      const response = await fetch(`/api/game/${ gameId.replace(/-/g, '_') }/join/${ playerId.replace(/-/g, '_') }`, {
        method: 'POST'
      });
      return response.ok;
    }
    return false;
  }

  async newGame() {
    const playerId = this.playerService.self();
    if (playerId) {
      const response = await fetch(`/api/game/new/`, {
        method: 'POST'
      });
      if (response.ok) {
        const body = await response.json();
        return body.id as (GameGUID | null) || null;
      }
    }
    return null;
  }

  fillFieldCell(gameId: GameGUID, rowIndex: number, columnIndex: number) {
    const playerId = this.playerService.self();
    if (playerId) {
      return fetch(`/api/game/${ gameId.replace(/-/g, '_') }/turn/`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          playerId,
          rowIndex,
          columnIndex
        })
      });
    }
  }
}

export const gamesService = new GamesService(playerService);
