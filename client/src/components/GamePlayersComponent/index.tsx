import React, { Component } from 'react';
import { Game, GameGUID, Player, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { gamesStore } from '../../stores/GamesStore';
import { playersSyncService } from '../../services/PlayersSyncService';
import PlayerListView from '../../views/PlayerListView';
import { playersStore } from '../../stores/PlayersStore';

interface GamePlayersComponentProps {
  game: GameGUID;
}

@observer
export default class GamePlayersComponent extends Component<GamePlayersComponentProps> {
  lastPlayerIdsSet: Set<PlayerGUID> = new Set();
  disposers: IReactionDisposer[] = [];

  @computed
  private get game(): Game<PlayerGUID> | null {
    const { game } = this.props;
    return gamesStore.get(game);
  }

  @computed
  private get players(): Player[] | null {
    const { game } = this;
    return game && playersStore.getList(game.players);
  }

  @computed
  private get playerIdsSet(): Set<PlayerGUID> {
    const { game } = this;
    const playerIdsSet = new Set<PlayerGUID>();
    if (game) {
      game.players.forEach(id => playerIdsSet.add(id));
      if (game.lastAction) {
        playerIdsSet.add(game.lastAction.player);
      }
    }
    return playerIdsSet;
  }

  componentDidMount(): void {
    this.disposers.push(autorun(() => {
      const playerIdsSet = this.playerIdsSet;
      const playerIds = Array.from(playerIdsSet.values());
      const playerIdsToSubscribe = playerIds.filter(id => !this.lastPlayerIdsSet.has(id));
      const lastGameIds = Array.from(this.lastPlayerIdsSet.values());
      const playerIdsToUnsubscribe = lastGameIds.filter(id => !playerIdsSet.has(id));
      this.lastPlayerIdsSet = playerIdsSet;
      playersSyncService.subscribe(playerIdsToSubscribe);
      playersSyncService.unsubscribe(playerIdsToUnsubscribe);
    }));
  }

  componentWillUnmount(): void {
    const { lastPlayerIdsSet } = this;
    const playerIds = Array.from(lastPlayerIdsSet.values());
    playersSyncService.unsubscribe(playerIds);
    this.disposers.forEach(disposer => disposer());
  }

  render() {
    const { players } = this;
    if (!players) {
      return 'Loading...';
    }
    return <PlayerListView players={players}/>;
  }
}
