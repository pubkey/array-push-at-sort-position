export type CompareFunction<T = any> = (a: T, b: T) => 1 | 0 | -1;

export function pushAtSortPosition<T>(
    array: T[],
    item: T,
    compareFunction: CompareFunction,
    // if set to true, it will not slice the array and mutate the input
    noCopy?: boolean
): T[];