import React, { Component } from 'react';
import styles from './styles.module.css';
import { Player } from '../../common/models';
import PlayerView from '../PlayerView';

interface PlayerListViewProps {
  players: Player[]
}

class PlayerListView extends Component<PlayerListViewProps> {
  render() {
    const { players } = this.props;
    return (
      <div className={styles.PlayerListView}>
        {
          players.map(player =>
            <PlayerView key={player.id} player={player}/>
          )
        }
      </div>
    );
  }
}

export default PlayerListView;
