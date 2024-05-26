export declare type modifiers = "tags" | "action" | "fixed"

export declare type leadDataI = {
    name: string;
    price: number | string;
    status_name: { data: string, other: modifiers };
    responsible_name: string;
    created_at: number | string;
};

export declare type leadDataWithContact = (leadDataI & {
    description?: {
        name: string,
        phone?: string,
        email?: string
    }
})[]

export declare type leadsDataI = leadDataI[]

export declare type rowData = (leadDataI & {
    key: number,
    description: string
})


export declare type tData = rowData[]

// type Decrement<N extends number> = [never, 0, 1, 2, 3, 4, 5, ...number[]][N];
export declare type Increment<N extends number> = [1, 2, 3, 4, 5, 6, 7, ...number[]][N];
//
// type trailingTuple<
//     T,
//     N extends number,
//     R extends unknown[] = [],
// > = R['length'] extends N
//     ? R
//     : R['length'] extends Decrement<N>
//         ? [T, ...R, ...string[]]
//         : trailingTuple<T, N, [T, ...R]>;

export type genNumbers<T extends number, CURRENT extends number = 0> = [CURRENT] extends [T] ? string :
    [T] extends [CURRENT]
        ? CURRENT
        : T | genNumbers<T, CURRENT | Increment<CURRENT>>

export type Tuple<T, N extends number> = N extends N
    ? number extends N
        ? T[]
        : _TupleOf<T, N, []>
    : never;

export type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

export type CreateMutable<Type> = {
    [Property in keyof Type]+?: Type[Property];
};

// Строки
export type tableRowWithOptional = {
    [key: string]: any
} & CreateMutable<rowData>
// Колонки

const enum columnHeadings {
    'Название',
    'Бюджет',
    'Статус',
    'Ответственный',
    'Дата создания',
}

export type columnsSpec<T extends object> = {
    title: keyof typeof columnHeadings;
    dataIndex?: mods<T>;
    key: mods<T>;
    fixed?: true | false;
};

export type columnSpec = columnsSpec<leadDataWithContact>

type mods<T extends object> = {
    [Property in keyof T]: { data: string, other: modifiers } extends T[Property]
        ? 'other' extends keyof T[Property] ? T[Property]['other'] : string
        : keyof T
}[keyof T]

// table.ts
export type arrLength<T extends readonly any[]> = T['length'];