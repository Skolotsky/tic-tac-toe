import { Player, PlayerGUID } from '../common/models';
import { HexColorString } from '../common/types';
import { stringToHexColorString } from './stringToHexColorString';

export const serializePlayer = (player: Player): string => {
  return JSON.stringify(player);
};

export const deserializePlayer = (string: string): Player => {
  const player = JSON.parse(string);
  return player;
};

export const playerGUIDToHexColorString = (cell: PlayerGUID): HexColorString  => stringToHexColorString(cell);
