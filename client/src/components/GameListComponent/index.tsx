import React, { Component } from 'react';
import { Game, GameGUID, GameInfo, PlayerGUID } from '../../common/models';
import GameListView from '../../views/GameListView';
import { observer } from 'mobx-react';
import { action, autorun, computed, IReactionDisposer } from 'mobx';
import { gameListService } from '../../services/GameListService';
import { gameListStore } from '../../stores/GameListStore';
import { gameInfosStore } from '../../stores/GameInfosStore';
import { gameInfosService } from '../../services/GameInfosService';

interface GameListComponentProps {
  onSelectGame: (game: GameGUID) => void
}

@observer
export default class GameListComponent extends Component<GameListComponentProps> {
  lastGameIdsSet: Set<GameGUID> = new Set();
  disposer?: IReactionDisposer;

  componentDidMount(): void {
    gameListService.subscribe();
    this.disposer = autorun(() => {
      const gameIdsSet = new Set(this.gameIds);
      const gameIdsToSubscribe = this.gameIds.filter(id => !this.lastGameIdsSet.has(id));
      const lastGameIds = Array.from(this.lastGameIdsSet.values());
      const gameIdsToUnsubscribe = lastGameIds.filter(id => !gameIdsSet.has(id));
      this.lastGameIdsSet = gameIdsSet;
      gameInfosService.subscribe(gameIdsToSubscribe);
      gameInfosService.unsubscribe(gameIdsToUnsubscribe);
    })
  }

  componentWillUnmount(): void {
    gameListService.unsubscribe();
    if (this.disposer) {
      this.disposer()
    }
    const gameIdsToUnsubscribe = Array.from(this.lastGameIdsSet.values());
    gameInfosService.subscribe(gameIdsToUnsubscribe);
  }

  @action
  onSelectGame = (game: GameInfo) => {
    const { onSelectGame } = this.props;
    onSelectGame(game.id);
  };

  @computed
  get gameIds() {
    return gameListStore.all;
  }

  @computed
  get games() {
    return gameInfosStore.getList(gameListStore.all);
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
