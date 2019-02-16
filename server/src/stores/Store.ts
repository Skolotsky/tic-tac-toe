import { computed, observable } from 'mobx';
import { Entity } from '@common/types';

export class Store<TEntity extends Entity<unknown>> {
  @observable
  protected entitiesMap = new Map<TEntity['id'], TEntity>();

  @computed
  get allIds(): TEntity['id'][] {
    return Array.from(this.entitiesMap.keys());
  }

  @computed
  get all(): TEntity[] {
    return Array.from(this.entitiesMap.values());
  }

  getList(ids: TEntity['id'][]): TEntity[] | null {
    const allExist = ids.every(id => this.entitiesMap.has(id));
    if (!allExist) {
      return null;
    }
    return ids.map(id => this.entitiesMap.get(id) as TEntity);
  }

  get(id: TEntity['id']): TEntity | null {
    return this.entitiesMap.get(id) || null;
  }

  set(id: TEntity['id'], entity: TEntity | null) {
    const existEntity = this.entitiesMap.get(id);
    if (existEntity) {
      if (entity) {
        Object.assign(existEntity, entity);
      } else {
        this.entitiesMap.delete(id);
      }
    } else if (entity) {
      this.entitiesMap.set(id, entity);
    }
  }

  has(id: TEntity['id']): boolean {
    return this.entitiesMap.has(id);
  }
}
