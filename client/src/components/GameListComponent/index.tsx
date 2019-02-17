import React, { Component } from 'react';
import { GameGUID, GameInfo } from '../../common/models';
import GameListView from '../../views/GameListView';
import { observer } from 'mobx-react';
import { autorun, computed, IReactionDisposer } from 'mobx';
import { gameListSyncService } from '../../services/GameListSyncService';
import { gameListStore } from '../../stores/GameListStore';
import { gameInfosStore } from '../../stores/GameInfosStore';
import { gameInfosSyncService } from '../../services/GameInfosSyncService';
import { gamesService } from '../../services/GamesService';
import { IdSubscription } from '../../lib/Subscriptions';

interface GameListComponentProps {
  onSelectGame: (game: GameGUID) => void
}

@observer
export default class GameListComponent extends Component<GameListComponentProps> {
  subscription?: IdSubscription<GameGUID>;
  disposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    gameListSyncService.subscribe();
    this.disposers.push(autorun(() => {
      const oldSubscription = this.subscription;
      this.subscription = gameInfosSyncService.subscribe(this.gameIds);
      if (oldSubscription) {
        gameInfosSyncService.unsubscribe(oldSubscription);
      }
    }))
  }

  componentWillUnmount(): void {
    this.disposers.forEach(disposer => disposer());
    gameListSyncService.unsubscribe();
    if (this.subscription) {
      gameInfosSyncService.unsubscribe(this.subscription)
    }
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
