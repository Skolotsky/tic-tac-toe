import React, { Component } from 'react';
import styles from './styles.module.css';
import { Cell, Field } from '../../common/models';
import CellTokenView from '../CellTokenView';
import { observer } from 'mobx-react';

interface FieldViewProps {
  field: Field;
  onSelectCell: (rowIndex: number, cellIndex: number) => void;
}

@observer
class FieldView extends Component<FieldViewProps> {
  render() {
    const { field, onSelectCell } = this.props;
    return (
      <table className={styles.FieldView}>
        <tbody>
          {
            field.map((row, rowIndex) =>
              <tr key={rowIndex} className={styles.row}>
                {
                  row.map( (cell, cellIndex) =>
                    <td key={cellIndex} className={styles.cell} onClick={() => onSelectCell(rowIndex, cellIndex)}>
                      <CellTokenView cell={cell}/>
                    </td>
                  )
                }
              </tr>
            )
          }
        </tbody>
      </table>
    );
  }
}

export default FieldView;
