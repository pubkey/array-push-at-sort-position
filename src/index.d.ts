export type CompareFunction<T = any> = (a: T, b: T) => 1 | 0 | -1;


/**
 * Push items to an array at their correct sort-position which is much faster then re-sorting the array.
 * 
 * Returns index at which the item was pushed.
 * Remember that JavaScript arrays start with index 0.
 */
export function pushAtSortPosition<T>(
    array: T[],
    item: T,
    compareFunction: CompareFunction,
    /**
     * Start lowest index
     * Use 0 by default. If you use this method to merge sorted arrays, you might
     * use a  higher value if you know that the newItem will not be positioned before that index.
     */
    low: number
): number;
