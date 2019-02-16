import React, { Component } from 'react';
import './App.css';
import { Game, GameGUID } from './common/models';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import GameComponent from './components/GameComponent';
import { webSocketService } from './services/WebSocketService';
import GameListComponent from './components/GameListComponent';
import { playerService } from './services/PlayerService';
import { gamesService } from './services/GamesService';
import ButtonView from './views/ButtonView';

@observer
class App extends Component {
  @observable
  selectedGame: GameGUID | null = null;

  @action
  onSelectGame = (id: GameGUID | null) => {
    this.selectedGame = id;
    if (id) {
      gamesService.joinGame(id);
    }
  };

  onNewGame = async () => {
    const id = await gamesService.newGame();
    this.onSelectGame(id);
  };

  render() {
    const { selectedGame, onSelectGame } = this;
    const self = playerService.self();
    if (!self) {
      return 'Getting player...';
    }
    if (webSocketService.isConnected) {
      return (
        <div className="App">
          <GameListComponent onSelectGame={ onSelectGame }/>
          <ButtonView onClick={this.onNewGame}>New Game</ButtonView>
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
