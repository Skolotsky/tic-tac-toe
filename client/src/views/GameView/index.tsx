import React, { Component } from 'react';
import styles from './styles.module.css';
import { Field, Game, Player } from '../../common/models';
import PlayerView from '../PlayerView';
import PlayerListView from '../PlayerListView';
import FieldView from '../FieldView';
import { observer } from 'mobx-react';
import { getWonCellType } from '../../common/lib/rules';
import CellTokenView from '../CellTokenView';

interface GameViewProps {
  player: Player;
  game: Game<Player>;
  onSelectCell: (rowIndex: number, cellIndex: number) => void;
}

@observer
class GameView extends Component<GameViewProps> {
  render() {
    const { game, onSelectCell } = this.props;
    const wonCellType = getWonCellType(game);
    return (
      <div className={styles.GameView}>
        <FieldView field={game.field} onSelectCell={onSelectCell}/>
        {
          wonCellType ?
            <>
              Winner is <CellTokenView cell={wonCellType}/>
              { game.lastAction ? <>(<PlayerView player={game.lastAction.player}/>)</> : null }
            </> :
            null
        }
        <PlayerListView players={game.players}/>
        Last player: { game.lastAction ? <PlayerView player={game.lastAction.player}/> : 'nobody' }
      </div>
    );
  }
}

export default GameView;
