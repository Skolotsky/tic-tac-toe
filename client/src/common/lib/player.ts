import { Player } from '../models';

export const serializePlayer = (player: Player): string => {
  return JSON.stringify(player);
};

export const deserializePlayer = (string: string): Player => {
  const player = JSON.parse(string);
  return player;
};
