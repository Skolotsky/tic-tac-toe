import React, { Component } from 'react';
import { Game, GameGUID, PlayerGUID } from '../../common/models';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import { gamesStore } from '../../stores/GamesStore';
import { gamesSyncService } from '../../services/GamesSyncService';
import { getAvailableCellType } from '../../common/lib/rules';
import FieldView from '../../views/FieldView';

interface FieldComponentProps {
  game: GameGUID;
  player: PlayerGUID;
}

@observer
export default class FieldComponent extends Component<FieldComponentProps> {
  @computed
  private get game(): Game<PlayerGUID> | null {
    const { game } = this.props;
    return gamesStore.get(game);
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
    const { game } = this;
    if (!game) {
      return 'Loading...';
    }
    return <FieldView field={game.field} onSelectCell={this.onSelectCell}/>;
  }
}
