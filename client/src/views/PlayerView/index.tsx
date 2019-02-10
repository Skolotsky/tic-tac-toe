import React, { Component } from 'react';
import styles from './styles.module.css';
import { Player } from '../../common/models';

interface PlayerViewProps {
  player: Player
}

class PlayerView extends Component<PlayerViewProps> {
  render() {
    const { player } = this.props;
    return (
      <div className={styles.PlayerView}>
        {player.id}
      </div>
    );
  }
}

export default PlayerView;
