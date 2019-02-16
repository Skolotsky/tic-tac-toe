import React, { Component } from 'react';
import styles from './styles.module.css';
import { observer } from 'mobx-react';
import classNames from 'classnames';

interface HeaderItemViewProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
}

@observer
class HeaderItemView extends Component<HeaderItemViewProps> {
  render() {
    const { className, ...props } = this.props;
    return (
      <div className={ classNames([ styles.HeaderItemView, className ]) } { ...props }>
        {this.props.children}
      </div>
    );
  }
}

export default HeaderItemView;
