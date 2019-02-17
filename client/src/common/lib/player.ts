import { Player, PlayerGUID } from '../models';

export const serializePlayer = (player: Player): string => {
  return JSON.stringify(player);
};

export const deserializePlayer = (string: string): Player => {
  const player = JSON.parse(string);
  return player;
};

let playerNameCounter = 1;

export const createPlayer = (id: PlayerGUID): Player => {
  return {
    id,
    name: `Player ${playerNameCounter++}`
  };
};
