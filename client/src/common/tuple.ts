import { Tuple } from './types';

export const tuple = <T, L extends number>(count: L, getValue: (index: number) => T): Tuple<T, L> => {
    const tuple = new Array<T>(count);
    for (let i = 0; i < count; i++) {
        tuple[i] = getValue(i);
    }
    return tuple as Tuple<T, L>;
};
