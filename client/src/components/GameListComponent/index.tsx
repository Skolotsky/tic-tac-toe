import React, { Component } from 'react';
import { Game, GameGUID, PlayerGUID } from '../../common/models';
import GameListView from '../../views/GameListView';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { gamesStore } from '../../stores/GamesStore';
import { gameListService } from '../../services/GameListService';
import { gameListStore } from '../../stores/GameListStore';

interface GameListComponentProps {
  onSelectGame: (game: GameGUID) => void
}

@observer
export default class GameListComponent extends Component<GameListComponentProps> {
  @observable
  selectedGame: Game<PlayerGUID> | null = null;

  componentDidMount(): void {
    gameListService.subscribe();
  }

  componentWillUnmount(): void {
    gameListService.unsubscribe();
  }

  @action
  onSelectGame = (game: Game<PlayerGUID>) => {
    const { onSelectGame } = this.props;
    onSelectGame(game.id);
  };

  @computed
  get games() {
    return gamesStore.getList(gameListStore.all);
  }

  render() {
    const { games, onSelectGame } = this;
    if (games) {
      return <GameListView games={ games } onSelectGame={ onSelectGame }/>;
    } else {
      return 'Loading...';
    }
  }
}
