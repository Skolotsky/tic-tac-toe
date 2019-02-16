import React, { Component } from 'react';
import { Player, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { playersStore } from '../../stores/PlayersStore';
import { playersSyncService } from '../../services/PlayersSyncService';
import PlayerView from '../../views/PlayerView';

interface PlayerComponentProps {
  player: PlayerGUID;
}

@observer
export default class PlayerComponent extends Component<PlayerComponentProps> {
  disposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    this.disposers.push(autorun(() => {
      const { player } = this.props;
      playersSyncService.subscribe([player]);
    }));
  }

  componentWillUnmount(): void {
    this.disposers.forEach(disposer => disposer());
    const { player } = this.props;
    playersSyncService.unsubscribe([player]);
  }

  componentWillReceiveProps(nextProps: Readonly<PlayerComponentProps>): void {
    if (nextProps.player !== this.props.player) {
      playersSyncService.unsubscribe([this.props.player]);
    }
  }

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
