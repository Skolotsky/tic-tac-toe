import React, { Component } from 'react';
import styles from './styles.module.css';
import { Cell, FilledCellType } from '../../common/models';

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

class CellTokenView extends Component<CellTokenViewProps> {
  render() {
    const { cell } = this.props;
    if (cell === null) {
      return null;
    }
    return (
      <span className={styles.CellTokenView}>
        { cellTypeToSymbol(cell) }
      </span>
    );
  }
}

export default CellTokenView;
