declare const NominalType: unique symbol;
export type Nominal<T, V = string> = V & { [NominalType]: T; };

export type GUID<T> = Nominal<T & 'GUID'>;

// жаль нельзя задать размер кортежа константой аля T[10]
// было бы количество большее или переменным - пришлось бы прибегать к другим методам обеспечения корректности
export type Tuple<T, L extends number> = L extends 10 ? [T, T, T, T, T, T, T, T, T, T] : never;

export type HexColorString = Nominal<'HexColorString', string>;

export type URLString = Nominal<'URLString', string>;

export interface Entity<ID> {
  id: ID
}
