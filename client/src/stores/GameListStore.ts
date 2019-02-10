import { GameGUID } from '../common/models';
import { action, computed, observable } from 'mobx';

export class GameListStore {
  @observable
  private ids: GameGUID[] = [];

  @computed
  get all(): GameGUID[] {
    return this.ids;
  }

  @action
  set(ids: GameGUID[]) {
    this.ids = ids;
  }
}

export const gameListStore = new GameListStore();
