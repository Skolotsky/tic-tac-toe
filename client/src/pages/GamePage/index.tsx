import React, { Component } from 'react';
import styles from './styles.module.css';
import commonStyles from '../../views/styles.module.css';
import { Game, GameGUID, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import LayoutView from '../../views/LayoutView';
import PlayerComponent from '../../components/PlayerComponent';
import HeaderItemView from '../../views/HeaderItemView';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { gamesSyncService } from '../../services/GamesSyncService';
import { gamesStore } from '../../stores/GamesStore';
import { getWonCellType, isGameFinished } from '../../common/lib/rules';
import FieldComponent from '../../components/FieldComponent';
import GamePlayersComponent from '../../components/GamePlayersComponent';
import CellTokenView from '../../views/CellTokenView';
import { IdSubscription } from '../../lib/Subscriptions';

interface GamePageProps {
  game: GameGUID;
  self: PlayerGUID;
  onBack: () => void;
}

@observer
class GamePage extends Component<GamePageProps> {
  subscription?: IdSubscription<GameGUID>;
  disposers: IReactionDisposer[] = [];

  @computed
  private get game(): Game<PlayerGUID> | null {
    const { game } = this.props;
    return gamesStore.get(game);
  }

  componentDidMount(): void {
    this.disposers.push(autorun(() => {
      const oldSubscription = this.subscription;
      const { game } = this.props;
      this.subscription = gamesSyncService.subscribe([game]);
      if (oldSubscription) {
        gamesSyncService.unsubscribe(oldSubscription);
      }
    }))
  }

  componentWillUnmount(): void {
    this.disposers.forEach(disposer => disposer());
    if (this.subscription) {
      gamesSyncService.unsubscribe(this.subscription)
    }
  }

  render() {
    const { self, onBack } = this.props;
    const { game } = this;
    if (!game) {
      return 'Loading...';
    }
    const wonCellType = getWonCellType(game);
    const finished = wonCellType || isGameFinished(game);
    return (
      <LayoutView>
        <LayoutView.HeaderLeft>
          <HeaderItemView className={styles.back} onClick={ onBack }>Back</HeaderItemView>
        </LayoutView.HeaderLeft>
        <LayoutView.HeaderCenter>
          <HeaderItemView className={commonStyles.title}>TIC TAC TOE</HeaderItemView>
        </LayoutView.HeaderCenter>
        <LayoutView.HeaderRight>
          <HeaderItemView className={commonStyles.player}><PlayerComponent player={self}/></HeaderItemView>
        </LayoutView.HeaderRight>
        <LayoutView.BodyLeft>
          <div>Game name</div>
          <div className={styles.gameName}>
            { game.name }
          </div>
          {
            wonCellType ?
              <div className={styles.finishedInfo}>
                <div>
                  {
                    game.lastAction ?
                      <PlayerComponent player={game.lastAction.player}/> :
                      <>Nobody</>
                  }
                </div>
                <div>
                  WIN
                </div>
                <div className={styles.winnerToken}>
                  <CellTokenView cell={wonCellType}/>
                </div>
              </div> :
              finished && <div className={styles.finishedInfo}>Finished</div>
          }
        </LayoutView.BodyLeft>
        <LayoutView.BodyCenter>
          <FieldComponent
            player={ self }
            game={ game.id }
          />
        </LayoutView.BodyCenter>
        <LayoutView.BodyRight>
          <div>Last player</div>
          <div className={styles.lastPlayer}>
            {
              game.lastAction ?
                <PlayerComponent player={game.lastAction.player}/> :
                <>Nobody</>
            }
          </div>
          <GamePlayersComponent game={game.id}/>
        </LayoutView.BodyRight>
      </LayoutView>
    );
  }
}

export default GamePage;
