import { Player, PlayerGUID } from '../models';
const uuidv1 = require('uuid/v1');

export const serializePlayer = (player: Player): string => {
  return JSON.stringify(player);
};

export const deserializePlayer = (string: string): Player => {
  const player = JSON.parse(string);
  return player;
};

let playerNameCounter = 1;

export const createPlayer = (): Player => {
  return {
    id: uuidv1() as PlayerGUID,
    name: `Player ${playerNameCounter++}`
  };
};
