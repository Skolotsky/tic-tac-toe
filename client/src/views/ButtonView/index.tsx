import React, { Component } from 'react';
import styles from './styles.module.css';
import { observer } from 'mobx-react';
import classNames from 'classnames';

interface ButtonViewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}

@observer
class ButtonView extends Component<ButtonViewProps> {
  render() {
    const { className, ...props } = this.props;
    return (
      <button className={ classNames([ styles.ButtonView, className ]) } { ...props }>
        {this.props.children}
      </button>
    );
  }
}

export default ButtonView;