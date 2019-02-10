import React, { Component } from 'react';
import styles from './styles.module.css';
import { Field, Game, Player } from '../../common/models';
import PlayerView from '../PlayerView';
import PlayerListView from '../PlayerListView';
import FieldView from '../FieldView';
import { observer } from 'mobx-react';

interface GameViewProps {
  player: Player;
  game: Game<Player>;
  onSelectCell: (rowIndex: number, cellIndex: number) => void;
}

@observer
class GameView extends Component<GameViewProps> {

  isSelfCell = (cell: Field.Cell) => {
    const { player } = this.props;
    return cell === player.id;
  };

  render() {
    const { game, onSelectCell } = this.props;
    return (
      <div className={styles.GameView}>
        <PlayerListView players={game.players}/>
        Last player: { game.lastAction ? <PlayerView player={game.lastAction.player}/> : 'nobody' }
        <FieldView field={game.field} isSelfCell={this.isSelfCell} onSelectCell={onSelectCell}/>
      </div>
    );
  }
}

export default GameView;
