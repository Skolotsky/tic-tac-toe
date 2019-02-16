import React, { Component } from 'react';
import styles from './styles.module.css';
import { observer } from 'mobx-react';
import HeaderItemView from '../HeaderItemView';

interface TitleViewProps {
}

@observer
class TitleView extends Component<TitleViewProps> {
  render() {
    return (
      <HeaderItemView className={styles.TitleView}>
        TIC TAC TOE
      </HeaderItemView>
    );
  }
}

export default TitleView;
