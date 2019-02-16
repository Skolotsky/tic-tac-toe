import React, { Component } from 'react';
import { Game, GameGUID, Player, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { action, autorun, computed, IReactionDisposer } from 'mobx';
import GameView from '../../views/GameView';
import { denormalizeGame } from '../../common/lib/game';
import { playersStore } from '../../stores/PlayersStore';
import { gamesStore } from '../../stores/GamesStore';
import { gamesSyncService } from '../../services/GamesSyncService';
import { playersSyncService } from '../../services/PlayersSyncService';
import { getAvailableCellType } from '../../common/lib/rules';

interface GameComponentProps {
  game: GameGUID;
  player: PlayerGUID;
}

@observer
export default class GameComponent extends Component<GameComponentProps> {
  lastPlayerIdsSet: Set<PlayerGUID> = new Set();
  disposers: IReactionDisposer[] = [];

  componentDidMount(): void {
    console.log('mount');
    this.disposers.push(autorun(() => {
      const { game } = this.props;
      gamesSyncService.subscribe([game]);
    }));
    this.disposers.push(autorun(() => {
      const playerIdsSet = this.playerIdsSet;
      const playerIds = Array.from(playerIdsSet.values());
      const playerIdsToSubscribe = playerIds.filter(id => !this.lastPlayerIdsSet.has(id));
      const lastGameIds = Array.from(this.lastPlayerIdsSet.values());
      const playerIdsToUnsubscribe = lastGameIds.filter(id => !playerIdsSet.has(id));
      this.lastPlayerIdsSet = playerIdsSet;
      playersSyncService.subscribe(playerIdsToSubscribe);
      playersSyncService.unsubscribe(playerIdsToUnsubscribe);
    }));
  }

  componentWillUnmount(): void {
    console.log('unmount');
    const { game } = this.props;
    gamesSyncService.unsubscribe([game]);
    this.disposers.forEach(disposer => disposer());
  }

  componentWillReceiveProps(nextProps: Readonly<GameComponentProps>): void {
    if (nextProps.game !== this.props.game) {
      gamesSyncService.unsubscribe([this.props.game]);
    }
  }

  @computed
  private get playerIdsSet(): Set<PlayerGUID> {
    const { game } = this;
    const playerIdsSet = new Set<PlayerGUID>();
    if (game) {
      game.players.forEach(id => playerIdsSet.add(id));
      if (game.lastAction) {
        playerIdsSet.add(game.lastAction.player);
      }
    }
    return playerIdsSet;
  }

  private getPlayer(id: PlayerGUID): Player | null {
    return playersStore.get(id)
  }

  @computed
  private get player(): Player | null {
    const { player } = this.props;
    return this.getPlayer(player);
  }

  @computed
  private get game(): Game<PlayerGUID> | null {
    const { game } = this.props;
    return gamesStore.get(game);
  }

  @computed
  private get denormalizedGame(): Game<Player> | null {
    const { game } = this;
    return game && denormalizeGame(game, playersStore);
  }

  @action
  private onSelectCell = (rowIndex: number, columnIndex: number) => {
    const { player } = this.props;
    const { game } = this;
    if (game && getAvailableCellType(player, game, rowIndex, columnIndex)) {
      gamesSyncService.fillFieldCell(game.id, rowIndex, columnIndex);
    }
  };

  render() {
    const { player, denormalizedGame } = this;
    if (!denormalizedGame || !player) {
      console.log(denormalizedGame, player);
      return 'Loading...';
    }
    return <GameView player={player} game={denormalizedGame} onSelectCell={this.onSelectCell}/>;
  }
}
