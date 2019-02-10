import React, { Component } from 'react';
import './App.css';
import { Game, GameGUID } from './common/models';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { player } from './mocks';
import GameComponent from './components/GameComponent';
import { webSocketService } from './services/WebSocketService';
import GameListComponent from './components/GameListComponent';



@observer
class App extends Component {
  @observable
  selectedGame: GameGUID | null = null;

  @action
  onSelectGame = (game: GameGUID) => {
    this.selectedGame = game;
    webSocketService.send({
      type: 'Game',
      data: game
    })
  };

  render() {
    const { selectedGame, onSelectGame } = this;
    if (webSocketService.isConnected) {
      return (
        <div className="App">
          <GameListComponent onSelectGame={ onSelectGame }/>
          { selectedGame ? <GameComponent player={ player.id } game={ selectedGame }/> : null }
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
