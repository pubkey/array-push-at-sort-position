/**
 * copied and adapted from npm 'binary-search-insert'
 * @link https://www.npmjs.com/package/binary-search-insert
 */
export function pushAtSortPosition(
    array,
    item,
    compareFunction,
    low
) {
    const length = array.length;
    let high = length - 1;

    /**
     * Optimization shortcut.
     */
    if (length === 0) {
        array.push(item);
        return 0;
    }

    /**
     * Optimization shortcut.
     * Item belongs at the end, use push() which is O(1)
     * instead of splice() which is O(n).
     */
    if (compareFunction(array[high], item) <= 0.0) {
        array.push(item);
        return length;
    }

    /**
     * Optimization shortcut.
     * Item belongs before the current low index,
     * so we can skip the binary search.
     */
    if (compareFunction(array[low], item) > 0.0) {
        array.splice(low, 0, item);
        return low;
    }

    let mid = 0;
    while (low <= high) {
        // https://github.com/darkskyapp/binary-search
        // http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
        mid = low + (high - low >> 1);
        if (compareFunction(array[mid], item) <= 0.0) {
            // searching too low
            low = mid + 1;
        } else {
            // searching too high
            high = mid - 1;
        }
    }

    /**
     * Insert at correct position.
     * After binary search, low is the correct insertion index.
     */
    array.splice(low, 0, item);

    return low;
}
