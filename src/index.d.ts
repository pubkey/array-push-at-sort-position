export type CompareFunction<T> = (a: T, b: T) => 1 | 0 | -1;

export function pushAtSortPosition<T>(
    array: T[],
    item: T,
    compareFunction: CompareFunction
): T[];