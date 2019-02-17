import React, { Component } from 'react';
import { Player, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { playersStore } from '../../stores/PlayersStore';
import { playersSyncService } from '../../services/PlayersSyncService';
import PlayerView from '../../views/PlayerView';
import { IdSubscription } from '../../lib/Subscriptions';

interface PlayerComponentProps {
  player: PlayerGUID;
}

@observer
export default class PlayerComponent extends Component<PlayerComponentProps> {
  disposers: IReactionDisposer[] = [];
  subscription?: IdSubscription<PlayerGUID>;

  componentDidMount(): void {
    this.disposers.push(autorun(() => {
      const { player } = this.props;
      const oldSubscription = this.subscription;
      this.subscription = playersSyncService.subscribe([player]);
      if (oldSubscription) {
        playersSyncService.unsubscribe(oldSubscription);
      }
    }));
  }

  componentWillUnmount(): void {
    this.disposers.forEach(disposer => disposer());
    if (this.subscription) {
      playersSyncService.unsubscribe(this.subscription);
    }
  }

  // componentWillReceiveProps(nextProps: Readonly<PlayerComponentProps>): void {
  //   if (nextProps.player !== this.props.player) {
  //     if (this.subscription) {
  //       playersSyncService.unsubscribe(this.subscription);
  //     }
  //   }
  // }

  @computed
  private get player(): Player | null {
    const { player } = this.props;
    return playersStore.get(player);
  }

  render() {
    const { player } = this;
    if (!player) {
      return 'Loading...';
    }
    return <PlayerView player={player}/>;
  }
}
