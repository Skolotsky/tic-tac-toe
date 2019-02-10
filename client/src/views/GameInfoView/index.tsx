import React, { Component } from 'react';
import styles from './styles.module.css';
import { Game } from '../../common/models';
import DateView from '../DateView';

interface GamePreViewProps<TGame extends Game> {
  game: TGame;
  onClick: () => void
}

class GameInfoView<TGame extends Game> extends Component<GamePreViewProps<TGame>> {


  render() {
    const { game, onClick } = this.props;
    const lastChangeDate = game.lastAction ? game.lastAction.date : game.createDate;
    const playersCount = game.players.length;
    return (
      <div className={styles.GameInfoView} onClick={onClick}>
        { playersCount }
        <DateView date={lastChangeDate}/>
      </div>
    );
  }
}

export default GameInfoView;
