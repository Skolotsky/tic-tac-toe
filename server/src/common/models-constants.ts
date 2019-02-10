import { tuple } from './tuple';
import { Field } from './models';

export const emptyField = tuple(10, () => tuple(10, () => null)) as Field;
