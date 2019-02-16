import React, { Component } from 'react';
import styles from './styles.module.css';
import { Cell, FilledCellType } from '../../common/models';
import { observer } from 'mobx-react';

const cellTypeToSymbol = (cellType: FilledCellType): string  => {
  switch (cellType) {
    case FilledCellType.Cross:
      return 'X';
    case FilledCellType.Nought:
      return '0';
  }
};

interface CellTokenViewProps {
  cell: Cell
}

@observer
class CellTokenView extends Component<CellTokenViewProps> {
  render() {
    const { cell } = this.props;
    if (cell === null) {
      return null;
    }
    if (cell === FilledCellType.Cross) {
      return (
        <svg style={{ margin: '-2px' }} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="48" x2="48" y2="2" stroke="black" strokeWidth="4"/>
          <line x1="2" y1="2" x2="48" y2="48" stroke="black" strokeWidth="4"/>
        </svg>
      );
    } else {
      return (
        <svg style={{ margin: '-2px' }} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="23" stroke="black" strokeWidth="4"/>
        </svg>
      );
    }
  }
}

export default CellTokenView;
