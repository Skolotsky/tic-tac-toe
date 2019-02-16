import React, { Component } from 'react';
import styles from './styles.module.css';
import commonStyles from '../../views/styles.module.css';
import { Game, GameGUID, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import LayoutView from '../../views/LayoutView';
import PlayerComponent from '../../components/PlayerComponent';
import HeaderItemView from '../../views/HeaderItemView';
import { action, autorun, computed, IReactionDisposer } from 'mobx';
import { gamesSyncService } from '../../services/GamesSyncService';
import { gamesStore } from '../../stores/GamesStore';
import { getAvailableCellType, getWonCellType } from '../../common/lib/rules';
import FieldComponent from '../../components/FieldComponent';
import GamePlayersComponent from '../../components/GamePlayersComponent';
import CellTokenView from '../../views/CellTokenView';

interface GamePageProps {
  game: GameGUID;
  self: PlayerGUID;
  onBack: () => void;
}

@observer
class GamePage extends Component<GamePageProps> {
  disposers: IReactionDisposer[] = [];

  @computed
  private get game(): Game<PlayerGUID> | null {
    const { game } = this.props;
    return gamesStore.get(game);
  }

  componentDidMount(): void {
    this.disposers.push(autorun(() => {
      const { game } = this.props;
      gamesSyncService.subscribe([game]);
    }));
  }

  componentWillUnmount(): void {
    const { game } = this.props;
    gamesSyncService.unsubscribe([game]);
    this.disposers.forEach(disposer => disposer());
  }

  componentWillReceiveProps(nextProps: Readonly<GamePageProps>): void {
    if (nextProps.game !== this.props.game) {
      gamesSyncService.unsubscribe([this.props.game]);
    }
  }

  @action
  private onSelectCell = (rowIndex: number, columnIndex: number) => {
    const { self } = this.props;
    const { game } = this;
    if (game && getAvailableCellType(self, game, rowIndex, columnIndex)) {
      gamesSyncService.fillFieldCell(game.id, rowIndex, columnIndex);
    }
  };

  render() {
    const { self, onBack } = this.props;
    const { game } = this;
    if (!game) {
      return 'Loading...';
    }
    const wonCellType = getWonCellType(game);
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
            wonCellType && (
              <>
                <div className={styles.winnerPlayer}>
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
              </>
            )
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
