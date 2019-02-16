import React, { Component } from 'react';
import styles from './styles.module.css';
import { Player } from '../../common/models';
import { playerGUIDToHexColorString } from '../../lib/player';
import { observer } from 'mobx-react';

interface PlayerViewProps {
  player: Player
}

@observer
class PlayerView extends Component<PlayerViewProps> {
  render() {
    const { player } = this.props;
    const color = playerGUIDToHexColorString(player.id);
    return (
      <span className={styles.PlayerView} style={{ color }}>
        {player.id}
      </span>
    );
  }
}

export default PlayerView;
