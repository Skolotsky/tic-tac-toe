import { Entity } from './types';

export interface EntitiesProvider<TEntity extends Entity<unknown>> {
    get(id: TEntity['id']): TEntity | null
    getList(ids: TEntity['id'][]): TEntity[] | null
}
