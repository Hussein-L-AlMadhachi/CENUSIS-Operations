import { PG_Table, type PG_App } from "pg-norm";
export declare class TeachingStaff extends PG_Table {
    constructor(app: PG_App);
    /** NOTE: availability_bitmap is used for automatic time table generation */
    create(): Promise<void>;
    insert(data: Record<string, any>): Promise<{
        [x: number]: import("postgres").Row;
        length: number;
        toString: () => string;
        toLocaleString: {
            (): string;
            (locales: string | string[], options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string;
        };
        pop: () => import("postgres").Row | undefined;
        push: (...items: import("postgres").Row[]) => number;
        concat: {
            (...items: ConcatArray<import("postgres").Row>[]): import("postgres").Row[];
            (...items: (import("postgres").Row | ConcatArray<import("postgres").Row>)[]): import("postgres").Row[];
        };
        join: (separator?: string) => string;
        reverse: () => import("postgres").Row[];
        shift: () => import("postgres").Row | undefined;
        slice: (start?: number, end?: number) => import("postgres").Row[];
        sort: (compareFn?: ((a: import("postgres").Row, b: import("postgres").Row) => number) | undefined) => import("postgres").RowList<import("postgres").Row[]>;
        splice: {
            (start: number, deleteCount?: number): import("postgres").Row[];
            (start: number, deleteCount: number, ...items: import("postgres").Row[]): import("postgres").Row[];
        };
        unshift: (...items: import("postgres").Row[]) => number;
        indexOf: (searchElement: import("postgres").Row, fromIndex?: number) => number;
        lastIndexOf: (searchElement: import("postgres").Row, fromIndex?: number) => number;
        every: {
            <S extends import("postgres").Row>(predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => value is S, thisArg?: any): this is S[];
            (predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => unknown, thisArg?: any): boolean;
        };
        some: (predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => unknown, thisArg?: any) => boolean;
        forEach: (callbackfn: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => void, thisArg?: any) => void;
        map: <U>(callbackfn: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => U, thisArg?: any) => U[];
        filter: {
            <S extends import("postgres").Row>(predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => value is S, thisArg?: any): S[];
            (predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => unknown, thisArg?: any): import("postgres").Row[];
        };
        reduce: {
            (callbackfn: (previousValue: import("postgres").Row, currentValue: import("postgres").Row, currentIndex: number, array: import("postgres").Row[]) => import("postgres").Row): import("postgres").Row;
            (callbackfn: (previousValue: import("postgres").Row, currentValue: import("postgres").Row, currentIndex: number, array: import("postgres").Row[]) => import("postgres").Row, initialValue: import("postgres").Row): import("postgres").Row;
            <U>(callbackfn: (previousValue: U, currentValue: import("postgres").Row, currentIndex: number, array: import("postgres").Row[]) => U, initialValue: U): U;
        };
        reduceRight: {
            (callbackfn: (previousValue: import("postgres").Row, currentValue: import("postgres").Row, currentIndex: number, array: import("postgres").Row[]) => import("postgres").Row): import("postgres").Row;
            (callbackfn: (previousValue: import("postgres").Row, currentValue: import("postgres").Row, currentIndex: number, array: import("postgres").Row[]) => import("postgres").Row, initialValue: import("postgres").Row): import("postgres").Row;
            <U>(callbackfn: (previousValue: U, currentValue: import("postgres").Row, currentIndex: number, array: import("postgres").Row[]) => U, initialValue: U): U;
        };
        find: {
            <S extends import("postgres").Row>(predicate: (value: import("postgres").Row, index: number, obj: import("postgres").Row[]) => value is S, thisArg?: any): S | undefined;
            (predicate: (value: import("postgres").Row, index: number, obj: import("postgres").Row[]) => unknown, thisArg?: any): import("postgres").Row | undefined;
        };
        findIndex: (predicate: (value: import("postgres").Row, index: number, obj: import("postgres").Row[]) => unknown, thisArg?: any) => number;
        fill: (value: import("postgres").Row, start?: number, end?: number) => import("postgres").RowList<import("postgres").Row[]>;
        copyWithin: (target: number, start: number, end?: number) => import("postgres").RowList<import("postgres").Row[]>;
        entries: () => ArrayIterator<[number, import("postgres").Row]>;
        keys: () => ArrayIterator<number>;
        values: () => ArrayIterator<import("postgres").Row>;
        includes: (searchElement: import("postgres").Row, fromIndex?: number) => boolean;
        flatMap: <U, This = undefined>(callback: (this: This, value: import("postgres").Row, index: number, array: import("postgres").Row[]) => U | readonly U[], thisArg?: This | undefined) => U[];
        flat: <A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[];
        at: (index: number) => import("postgres").Row | undefined;
        findLast: {
            <S extends import("postgres").Row>(predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => value is S, thisArg?: any): S | undefined;
            (predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => unknown, thisArg?: any): import("postgres").Row | undefined;
        };
        findLastIndex: (predicate: (value: import("postgres").Row, index: number, array: import("postgres").Row[]) => unknown, thisArg?: any) => number;
        toReversed: () => import("postgres").Row[];
        toSorted: (compareFn?: ((a: import("postgres").Row, b: import("postgres").Row) => number) | undefined) => import("postgres").Row[];
        toSpliced: {
            (start: number, deleteCount: number, ...items: import("postgres").Row[]): import("postgres").Row[];
            (start: number, deleteCount?: number): import("postgres").Row[];
        };
        with: (index: number, value: import("postgres").Row) => import("postgres").Row[];
        [Symbol.iterator]: (() => ArrayIterator<import("postgres").Row>) & (() => Iterator<import("postgres").Row, any, any>);
        readonly [Symbol.unscopables]: {
            [x: number]: boolean | undefined;
            length?: boolean;
            toString?: boolean;
            toLocaleString?: boolean;
            pop?: boolean;
            push?: boolean;
            concat?: boolean;
            join?: boolean;
            reverse?: boolean;
            shift?: boolean;
            slice?: boolean;
            sort?: boolean;
            splice?: boolean;
            unshift?: boolean;
            indexOf?: boolean;
            lastIndexOf?: boolean;
            every?: boolean;
            some?: boolean;
            forEach?: boolean;
            map?: boolean;
            filter?: boolean;
            reduce?: boolean;
            reduceRight?: boolean;
            find?: boolean;
            findIndex?: boolean;
            fill?: boolean;
            copyWithin?: boolean;
            entries?: boolean;
            keys?: boolean;
            values?: boolean;
            includes?: boolean;
            flatMap?: boolean;
            flat?: boolean;
            at?: boolean;
            findLast?: boolean;
            findLastIndex?: boolean;
            toReversed?: boolean;
            toSorted?: boolean;
            toSpliced?: boolean;
            with?: boolean;
            [Symbol.iterator]?: boolean;
            readonly [Symbol.unscopables]?: boolean;
        };
        columns: import("postgres").ColumnList<string | number>;
        count: number;
        command: string;
        statement: import("postgres").Statement;
        state: import("postgres").State;
    }>;
}
export declare const teaching_staff: TeachingStaff;
//# sourceMappingURL=teaching_staff.d.ts.map