import { Entity } from './types';

export interface EntitiesProvider<TEntity extends Entity<unknown>> {
    get(id: TEntity['id']): TEntity | null
    getList(ids: TEntity['id'][]): TEntity[] | null
}

export interface EntityProvider<TEntity extends Entity<unknown>> {
    get(id: TEntity['id']): TEntity | null
}

export interface EntityConsumer<TEntity extends Entity<unknown>> {
    set(id: TEntity['id'], entity: TEntity): void
}
