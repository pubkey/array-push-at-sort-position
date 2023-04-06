/**
 * copied and adapted from npm 'binary-search-insert'
 * @link https://www.npmjs.com/package/binary-search-insert
 */
export function pushAtSortPosition(
    array,
    item,
    compareFunction,
    noCopy
) {
    const ret = noCopy ? array : array.slice(0);
    const length = array.length;

    let high = length - 1;
    let low = 0;
    let mid = 0;

    /**
     * Optimization shortcut.
     */
    if (length === 0) {
        ret.push(item);
        return [ret, 0];
    }

    /**
     * So we do not have to ghet the ret[mid] doc again
     * at the last we store it here.
     */
    let lastMidDoc;

    while (low <= high) {
        // https://github.com/darkskyapp/binary-search
        // http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
        mid = low + (high - low >> 1);
        lastMidDoc = ret[mid];
        if (compareFunction(lastMidDoc, item) <= 0.0) {
            // searching too low
            low = mid + 1;
        } else {
            // searching too high
            high = mid - 1;
        }
    }

    if (compareFunction(lastMidDoc, item) <= 0.0) {
        mid++;
    }

    /**
     * Insert at correct position
     */
    ret.splice(mid, 0, item);

    return [ret, mid];
}
