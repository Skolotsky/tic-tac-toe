import { computed, observable } from 'mobx';

export class Store<ID, T> {
  @observable
  protected entitiesMap = new Map<ID, T>();

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

  set(id: ID, entity: T) {
    const existEntity = this.entitiesMap.get(id);
    if (existEntity) {
      Object.assign(existEntity, entity);
    } else {
      this.entitiesMap.set(id, entity);
    }
  }

  has(id: ID): boolean {
    return this.entitiesMap.has(id);
  }
}
