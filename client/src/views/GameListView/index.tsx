import React, { Component } from 'react';
import styles from './styles.module.css';
import { GameInfo } from '../../common/models';
import { observer } from 'mobx-react';
import DateView from '../DateView';

interface GameListViewProps {
  games: GameInfo[]
  onSelectGame: (game: GameInfo) => void
  onNewGame: () => void
}

@observer
class GameListView extends Component<GameListViewProps> {

  render() {
    const { games, onSelectGame, onNewGame } = this.props;
    return (
      <div className={styles.GameListView}>
        <div className={styles.newGame} onClick={ onNewGame }>NEW GAME</div>
        <div className={styles.caption}>GAME LIST</div>
        <div className={styles.header}>
          <div className={styles.nameColumn}>Name</div>
          <div className={styles.playersColumn}>Players</div>
          <div className={styles.dateColumn}>Last action</div>
        </div>
        <div className={styles.body}>
          {
            games.map(game =>
              <div key={ game.id } className={styles.row} onClick={() => onSelectGame(game) }>
                <div className={styles.nameColumn}>{ game.name }</div>
                <div className={styles.playersColumn}>{ game.playersCount }</div>
                <div className={styles.dateColumn}><DateView date={game.lastActionDate}/></div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default GameListView;
