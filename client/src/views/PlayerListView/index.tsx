import React, { Component } from 'react';
import styles from './styles.module.css';
import { Player } from '../../common/models';
import PlayerView from '../PlayerView';
import { observer } from 'mobx-react';

interface PlayerListViewProps {
  players: Player[]
}

@observer
class PlayerListView extends Component<PlayerListViewProps> {
  render() {
    const { players } = this.props;
    return (
      <div className={styles.PlayerListView}>
        {
          players.map(player =>
            <div key={player.id}><PlayerView player={player}/></div>
          )
        }
      </div>
    );
  }
}

export default PlayerListView;
