import React, { Component } from 'react';
import './App.css';
import { GameGUID } from './common/models';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import GameComponent from './components/GameComponent';
import { webSocketService } from './services/WebSocketService';
import GameListComponent from './components/GameListComponent';
import { playerService } from './services/PlayerService';
import { gamesSyncService } from './services/GamesSyncService';

@observer
class App extends Component {
  @observable
  selectedGame: GameGUID | null = null;

  @action
  onSelectGame = (id: GameGUID | null) => {
    this.selectedGame = id;
    if (id) {
      gamesSyncService.joinGame(id);
    }
  };

  onNewGame = async () => {
    const id = await gamesSyncService.newGame();
    this.onSelectGame(id);
  };

  render() {
    const { selectedGame, onSelectGame, onNewGame } = this;
    const self = playerService.self();
    if (!self) {
      return 'Getting player...';
    }
    if (webSocketService.isConnected) {
      return (
        <div className="App">
          <GameListComponent onSelectGame={ onSelectGame } onNewGame={ onNewGame }/>
          {
            selectedGame ?
              <GameComponent
                player={ self }
                game={ selectedGame }
              /> :
              null
          }
        </div>
      );
    }
    return (
      <div className="App">
        Connecting...
      </div>
    );
  }
}

export default App;
