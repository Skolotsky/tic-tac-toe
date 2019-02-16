import { stringToHexColorString } from './stringToHexColorString';
import { PlayerGUID } from '../common/models';
import { HexColorString } from '../common/types';

export const playerGUIDToHexColorString = (cell: PlayerGUID): HexColorString  => stringToHexColorString(cell);
