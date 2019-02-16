import { tuple } from './tuple';
import { Field } from './models';

export const ROWS_COUNT = 10;
export const COLUMNS_COUNT = 10;
export const emptyField = tuple(ROWS_COUNT, () => tuple(COLUMNS_COUNT, () => null)) as Field;
