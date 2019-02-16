import { GameInfo } from '../models';
import { Nominal } from '../types';

export type SerializedGameInfoString = Nominal<'SerializedGameString'>;

export const serializeGameInfo = (gameInfo: GameInfo): string => {
  return JSON.stringify(gameInfo) as SerializedGameInfoString;
};

export const deserializeGameInfo = (string: string): GameInfo => {
  const gameInfo = JSON.parse(string);
  gameInfo.lastActionDate = gameInfo.lastActionDate && (new Date(gameInfo.lastActionDate));
  return gameInfo;
};
