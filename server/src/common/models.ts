import { GUID, Nominal, Tuple } from './types';

//

export type PlayerGUID = GUID<'Player'>;

export interface Player {
    id: PlayerGUID;
}

//

export namespace Field {
    export type FilledCell = Nominal<'FilledCell', PlayerGUID>;
    export type Cell = FilledCell | null;
    export type Row = Tuple<Cell, 10>;
    export const RowsCount = 10;
    export const ColumnsCount = 10;
}
export type Field = Tuple<Field.Row, 10>;

//

export interface GameAction<TPlayer = unknown> {
    player: TPlayer;
    date: Date;
}

//

export type GameGUID = GUID<'Game'>;

export interface Game<TPlayer = unknown> {
    id: GameGUID;
    createDate: Date;
    players: TPlayer[];
    field: Field;
    lastAction: GameAction<TPlayer> | null
}

//

export interface GameInfo {
    id: GameGUID;
    lastActionDate: Date;
    playersCount: number;
}

//

export interface GameList<TGame = unknown> {
    games: TGame[]
}
