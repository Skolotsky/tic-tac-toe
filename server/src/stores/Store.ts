import { computed, observable } from 'mobx';

export interface IStore<ID, T> {
  get(id: ID): T | null;
}

export class Store<ID, T> {
  @observable
  protected entitiesMap = new Map<ID, T>();

  @computed
  get allIds(): ID[] {
    return Array.from(this.entitiesMap.keys());
  }

  @computed
  get all(): T[] {
    return Array.from(this.entitiesMap.values());
  }

  getList(ids: ID[]): T[] | null {
    const allExist = ids.every(id => this.entitiesMap.has(id));
    if (!allExist) {
      return null;
    }
    return ids.map(id => this.entitiesMap.get(id) as T);
  }

  get(id: ID): T | null {
    return this.entitiesMap.get(id) || null;
  }

  has(id: ID): boolean {
    return this.entitiesMap.has(id);
  }
}
