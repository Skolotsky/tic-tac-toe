import React, { Component } from 'react';
import styles from './styles.module.css';

interface DateViewProps {
  date: Date
}

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
