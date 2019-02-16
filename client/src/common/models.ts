import { GUID, Tuple } from './types';

//

export type PlayerGUID = GUID<'Player'>;

export interface Player {
    id: PlayerGUID;
    name: string;
}

//

export enum FilledCellType {
    Nought = 1,
    Cross = 2
}
export type FilledCell = FilledCellType;
export type Cell = FilledCell | null;
export type Row = Tuple<Cell, 10>;
export type Field = Tuple<Row, 10>;

//

export interface GameAction<TPlayer = unknown> {
    filledCell: FilledCell;
    player: TPlayer;
    date: Date;
}

//

export type GameGUID = GUID<'Game'>;

export interface Game<TPlayer = unknown> {
    id: GameGUID;
    name: string;
    createDate: Date;
    players: TPlayer[];
    field: Field;
    lastAction: GameAction<TPlayer> | null
}

//

export interface GameInfo {
    id: GameGUID;
    name: string;
    lastActionDate: Date;
    playersCount: number;
    finished: boolean;
}

//

export interface GameList {
    games: GameGUID[]
}
