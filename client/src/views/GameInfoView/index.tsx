import React, { Component } from 'react';
import styles from './styles.module.css';
import { GameInfo } from '../../common/models';
import DateView from '../DateView';

interface GameInfoViewProps {
  game: GameInfo;
  onClick: () => void
}

class GameInfoView extends Component<GameInfoViewProps> {

  render() {
    const { game, onClick } = this.props;
    return (
      <div className={styles.GameInfoView} onClick={onClick}>
        { game.playersCount }
        <DateView date={game.lastActionDate}/>
      </div>
    );
  }
}

export default GameInfoView;
