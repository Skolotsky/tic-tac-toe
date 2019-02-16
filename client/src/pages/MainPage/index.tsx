import React, { Component } from 'react';
import { GameGUID, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import LayoutView from '../../views/LayoutView';
import { gamesSyncService } from '../../services/GamesSyncService';
import GameListComponent from '../../components/GameListComponent';
import PlayerComponent from '../../components/PlayerComponent';
import commonStyles from '../../views/styles.module.css';
import HeaderItemView from '../../views/HeaderItemView';
import styles from '../GamePage/styles.module.css';

interface MainPageProps {
  self: PlayerGUID;
  onJoinedGame: (id: GameGUID) => void;
}

@observer
class MainPage extends Component<MainPageProps> {
  onSelectGame = async (id: GameGUID) => {
    const { onJoinedGame } = this.props;
    const isJoined = await gamesSyncService.joinGame(id);
    if (isJoined) {
      return onJoinedGame(id)
    }
  };

  onNewGame = async () => {
    const id = await gamesSyncService.newGame();
    if (id) {
      return this.onSelectGame(id);
    }
  };

  render() {
    const { self } = this.props;
    const { onSelectGame, onNewGame } = this;
    return (
      <LayoutView>
        <LayoutView.HeaderCenter>
          <HeaderItemView className={commonStyles.title}>TIC TAC TOE</HeaderItemView>
        </LayoutView.HeaderCenter>
        <LayoutView.HeaderRight>
          <HeaderItemView className={commonStyles.player}><PlayerComponent player={self}/></HeaderItemView>
        </LayoutView.HeaderRight>
        <LayoutView.BodyCenter>
          <GameListComponent onSelectGame={ onSelectGame } onNewGame={ onNewGame }/>
        </LayoutView.BodyCenter>
      </LayoutView>
    );
  }
}

export default MainPage;
