import React, { Component, ReactElement, ReactNode } from 'react';
import styles from './styles.module.css';
import { observer } from 'mobx-react';

interface LayoutViewProps {
  children: ReactElement<any>[] | ReactElement<any>;
}

interface LayoutViewPartProps {
  children: ReactNode[] | ReactNode;
}

const findChildOfType = (children: ReactElement<any>[], type: ReactElement<any>['type']) => (
  (children as ReactElement<any>[]).find(child => child.type === type)
);

@observer
class LayoutView extends Component<LayoutViewProps> {
  static HeaderLeft = (props: LayoutViewPartProps) => <>{props.children}</>;
  static HeaderCenter = (props: LayoutViewPartProps) => <>{props.children}</>;
  static HeaderRight = (props: LayoutViewPartProps) => <>{props.children}</>;
  static BodyLeft = (props: LayoutViewPartProps) => <>{props.children}</>;
  static BodyCenter = (props: LayoutViewPartProps) => <>{props.children}</>;
  static BodyRight = (props: LayoutViewPartProps) => <>{props.children}</>;

  render() {
    let { children } = this.props;
    if (!children) {
      return null;
    }
    if (!Array.isArray(children)) {
      children = [children];
    }
    const headerLeft = findChildOfType(children as ReactElement<any>[], LayoutView.HeaderLeft);
    const headerCenter = findChildOfType(children as ReactElement<any>[], LayoutView.HeaderCenter);
    const headerRight = findChildOfType(children as ReactElement<any>[], LayoutView.HeaderRight);
    const bodyLeft = findChildOfType(children as ReactElement<any>[], LayoutView.BodyLeft);
    const bodyCenter = findChildOfType(children as ReactElement<any>[], LayoutView.BodyCenter);
    const bodyRight = findChildOfType(children as ReactElement<any>[], LayoutView.BodyRight);
    return (
      <div className={styles.LayoutView}>
        <div className={styles.headerLeft}>{ headerLeft }</div>
        <div className={styles.headerCenter}>{ headerCenter }</div>
        <div className={styles.headerRight}>{ headerRight }</div>
        <div className={styles.bodyLeft}>{ bodyLeft }</div>
        <div className={styles.bodyCenter}>{ bodyCenter }</div>
        <div className={styles.bodyRight}>{ bodyRight }</div>
      </div>
    );
  }
}

export default LayoutView;
