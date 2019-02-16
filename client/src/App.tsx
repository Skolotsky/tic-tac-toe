import React, { Component } from 'react';
import styles from './styles.module.css';
import { GameGUID } from './common/models';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { webSocketService } from './services/WebSocketService';
import { playerService } from './services/PlayerService';
import MainPage from './pages/MainPage';
import GamePage from './pages/GamePage';

@observer
class App extends Component {
  @observable
  selectedGame: GameGUID | null = null;

  @action
  onJoinedGame = (id: GameGUID) => {
    this.selectedGame = id;
  };

  @action
  onBack = () => {
    this.selectedGame = null;
  };


  render() {
    const { selectedGame, onJoinedGame, onBack } = this;
    const self = playerService.self();
    if (!self) {
      return 'Getting player...';
    }
    if (!webSocketService.isConnected) {
      return 'Connecting...';
    }
    return (
      <div className={styles.App}>
        {
          selectedGame ?
            <GamePage game={ selectedGame } self={ self } onBack={ onBack }/> :
            <MainPage self={self} onJoinedGame={ onJoinedGame }/>
        }
      </div>
    );
  }
}

export default App;
