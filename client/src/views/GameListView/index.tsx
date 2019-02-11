import React, { Component } from 'react';
import styles from './styles.module.css';
import GameInfoView from '../GameInfoView';
import { GameInfo } from '../../common/models';

interface GameListViewProps {
  games: GameInfo[]
  onSelectGame: (game: GameInfo) => void
}

class GameListView extends Component<GameListViewProps> {

  render() {
    const { games, onSelectGame } = this.props;
    return (
      <div className={styles.GameListView}>
        {
          games.map(game =>
            <GameInfoView key={game.id} game={game} onClick={() => onSelectGame(game)}/>
          )
        }
      </div>
    );
  }
}

export default GameListView;
