import React, { Component } from 'react';
import styles from './styles.module.css';
import { stringToHexColorString } from '../../lib/stringToHexColorString';
import { Field } from '../../common/models';
import { HexColorString } from '../../common/types';

const filledCellToHexColorString = (cell: Field.FilledCell): HexColorString  => stringToHexColorString(cell);

interface CellTokenViewProps {
  cell: Field.Cell
  isSelfCell: (cell: Field.Cell) => boolean
}

class CellTokenView extends Component<CellTokenViewProps> {
  render() {
    const { cell, isSelfCell } = this.props;
    if (cell === null) {
      return null;
    }
    const color = filledCellToHexColorString(cell);
    const isSelf = isSelfCell(cell);
    console.log(cell, isSelf, color);
    return (
      <span className={styles.CellTokenView} style={{ color }}>
        { isSelf ? 'X' : '0' }
      </span>
    );
  }
}

export default CellTokenView;
