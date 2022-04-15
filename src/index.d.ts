export type CompareFunction<T = any> = (a: T, b: T) => 1 | 0 | -1;

export function pushAtSortPosition<T>(
    array: T[],
    item: T,
    compareFunction: CompareFunction,
    // if set to true, it will not slice the array and mutate the input
    noCopy?: boolean
): {
    /**
     * the array with the inserted item at the correct position.
     */
    array: T[];
    /**
     * The index at which the items was pushed.
     * Remember that JavaScript arrays start with index 0
     */
    postition: number;
};
