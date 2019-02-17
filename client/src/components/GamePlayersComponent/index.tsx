import React, { Component } from 'react';
import { Game, GameGUID, Player, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { gamesStore } from '../../stores/GamesStore';
import { playersSyncService } from '../../services/PlayersSyncService';
import PlayerListView from '../../views/PlayerListView';
import { playersStore } from '../../stores/PlayersStore';
import { IdSubscription } from '../../lib/Subscriptions';

interface GamePlayersComponentProps {
  game: GameGUID;
}

@observer
export default class GamePlayersComponent extends Component<GamePlayersComponentProps> {
  subscription?: IdSubscription<PlayerGUID>;
  disposers: IReactionDisposer[] = [];

  @computed
  private get game(): Game<PlayerGUID> | null {
    const { game } = this.props;
    return gamesStore.get(game);
  }

  @computed
  private get playerIds(): PlayerGUID[] {
    const { game } = this;
    return game && game.players || [];
  }

  @computed
  private get players(): Player[] | null {
    const { playerIds } = this;
    return playersStore.getList(playerIds);
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
      const oldSubscription = this.subscription;
      this.subscription = playersSyncService.subscribe(this.playerIds);
      if (oldSubscription) {
        playersSyncService.unsubscribe(oldSubscription);
      }
    }))
  }

  componentWillUnmount(): void {
    this.disposers.forEach(disposer => disposer());
    if (this.subscription) {
      playersSyncService.unsubscribe(this.subscription)
    }
  }

  render() {
    const { players } = this;
    if (!players) {
      return 'Loading...';
    }
    return <PlayerListView players={players}/>;
  }
}
