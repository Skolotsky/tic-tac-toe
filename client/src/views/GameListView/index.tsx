import React, { Component } from 'react';
import styles from './styles.module.css';
import GameInfoView from '../GameInfoView';
import { Game } from '../../common/models';

interface GameListViewProps<TGame extends Game> {
  games: TGame[]
  onSelectGame: (game: TGame) => void
}

class GameListView<TGame extends Game> extends Component<GameListViewProps<TGame>> {

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
