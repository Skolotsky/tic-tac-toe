import React, { Component } from 'react';
import { Field, Game, GameGUID, Player, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import GameView from '../../views/GameView';
import { denormalizeGame } from '../../lib/game';
import { playersStore } from '../../stores/PlayersStore';
import { gamesStore } from '../../stores/GamesStore';

const fillFieldCell = (player: PlayerGUID, field: Field, rowIndex: number, columnIndex: number) => (
  field[rowIndex][columnIndex] = player as Field.Cell
);

interface GameComponentProps {
  game: GameGUID;
  player: PlayerGUID;
}

@observer
export default class GameComponent extends Component<GameComponentProps> {
  @computed
  private get game(): Game<Player> | null {
    const { game: id } = this.props;
    const game = gamesStore.get(id);
    return game && denormalizeGame(game, playersStore);
  }

  @computed
  private get player(): Player | null {
    const { player } = this.props;
    return playersStore.get(player);
  }

  @action
  private onSelectCell = (rowIndex: number, columnIndex: number) => {
    const { game, player } = this;
    if (player && game) {
      fillFieldCell(player.id, game.field, rowIndex, columnIndex);
    }
  };

  render() {
    const { player, game } = this;
    if (!game || !player) {
      return 'Loading...';
    }
    return <GameView player={player} game={game} onSelectCell={this.onSelectCell}/>;
  }
}
