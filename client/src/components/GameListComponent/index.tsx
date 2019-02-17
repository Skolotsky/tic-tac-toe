import React, { Component } from 'react';
import { GameGUID, GameInfo } from '../../common/models';
import GameListView from '../../views/GameListView';
import { observer } from 'mobx-react';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { gameListSyncService } from '../../services/GameListSyncService';
import { gameListStore } from '../../stores/GameListStore';
import { gameInfosStore } from '../../stores/GameInfosStore';
import { gameInfosSyncService } from '../../services/GameInfosSyncService';
import { gamesSyncService } from '../../services/GamesSyncService';
import { gamesService } from '../../services/GamesService';

interface GameListComponentProps {
  onSelectGame: (game: GameGUID) => void
}

@observer
export default class GameListComponent extends Component<GameListComponentProps> {
  lastGameIdsSet: Set<GameGUID> = new Set();
  disposer?: IReactionDisposer;

  componentDidMount(): void {
    gameListSyncService.subscribe();
    this.disposer = autorun(() => {
      const gameIdsSet = new Set(this.gameIds);
      const gameIdsToSubscribe = this.gameIds.filter(id => !this.lastGameIdsSet.has(id));
      const lastGameIds = Array.from(this.lastGameIdsSet.values());
      const gameIdsToUnsubscribe = lastGameIds.filter(id => !gameIdsSet.has(id));
      this.lastGameIdsSet = gameIdsSet;
      gameInfosSyncService.subscribe(gameIdsToSubscribe);
      gameInfosSyncService.unsubscribe(gameIdsToUnsubscribe);
    })
  }

  componentWillUnmount(): void {
    gameListSyncService.unsubscribe();
    if (this.disposer) {
      this.disposer()
    }
    const gameIdsToUnsubscribe = Array.from(this.lastGameIdsSet.values());
    gameInfosSyncService.subscribe(gameIdsToUnsubscribe);
  }

  onSelectGame = (game: GameInfo) => {
    const { onSelectGame } = this.props;
    onSelectGame(game.id);
  };

  onNewGame = async () => {
    const { onSelectGame } = this.props;
    const id = await gamesService.newGame();
    if (id) {
      onSelectGame(id);
    }
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
    const { games, onSelectGame, onNewGame } = this;
    if (games) {
      return <GameListView games={ games } onSelectGame={ onSelectGame } onNewGame={onNewGame}/>;
    } else {
      return 'Loading...';
    }
  }
}
