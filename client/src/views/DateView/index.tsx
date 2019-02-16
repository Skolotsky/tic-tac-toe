import React, { Component } from 'react';
import styles from './styles.module.css';
import { observer } from 'mobx-react';

interface DateViewProps {
  date: Date
}

@observer
class DateView extends Component<DateViewProps> {
  render() {
    const { date } = this.props;
    return (
      <div className={styles.DateView}>
        {date.toLocaleDateString()}
      </div>
    );
  }
}

export default DateView;
