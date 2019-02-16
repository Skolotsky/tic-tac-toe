import React, { Component } from 'react';
import styles from './styles.module.css';
import { observer } from 'mobx-react';

interface ButtonViewProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

@observer
class ButtonView extends Component<ButtonViewProps> {
  render() {
    return (
      <button className={styles.ButtonView} {...this.props}>
        {this.props.children}
      </button>
    );
  }
}

export default ButtonView;
