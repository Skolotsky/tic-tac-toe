import { Player } from '../common/models';

export const serializePlayer = (player: Player): string => {
  return JSON.stringify(player);
};

export const deserializePlayer = (string: string): Player => {
  const player = JSON.parse(string);
  player.lastActionDate = player.lastActionDate && (new Date(player.lastActionDate));
  return player;
};
