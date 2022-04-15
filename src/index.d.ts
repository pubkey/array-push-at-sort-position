export type CompareFunction<T = any> = (a: T, b: T) => 1 | 0 | -1;

export function pushAtSortPosition<T>(
    array: T[],
    item: T,
    compareFunction: CompareFunction,
    // if set to true, it will not slice the array and mutate the input
    noCopy?: boolean
): [
        /**
         * We return an array with 2 items instead of an object.
         * This has shown to be faster in the test in ./array-vs-object.js
         */

        /**
         * the array with the inserted item at the correct position.
         */
        T[],

        /**
         * The index at which the items was pushed.
         * Remember that JavaScript arrays start with index 0
         */
        number
    ];
