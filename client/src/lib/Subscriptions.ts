import { action, computed, observable } from 'mobx';

export interface IdSubscription<ID> {
  ids: ID[];
}

export class IdSubscriptions<ID> {
  @observable
  private subscriptions: IdSubscription<ID>[] = [];

  @computed
  get ids(): Set<ID> {
    const idsSet = new Set<ID>();
    this.subscriptions.forEach(({ ids }) => ids.forEach(id => idsSet.add(id)));
    return idsSet;
  }

  @action
  addSubscription(ids: ID[]): IdSubscription<ID> {
    this.subscriptions.push({ ids });
    return this.subscriptions[this.subscriptions.length - 1];
  }

  @action
  removeSubscription(subscription: IdSubscription<ID>) {
    let index = this.subscriptions.indexOf(subscription);
    if (index >= 0) {
      this.subscriptions.splice(index, 1);
    }
  }
}
