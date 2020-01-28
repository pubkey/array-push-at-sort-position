/**
 * copied from npm 'binary-search-insert'
 * @link https://www.npmjs.com/package/binary-search-insert
 */
export function pushAtSortPosition(
    array,
    item,
    compareFunction,
    noCopy
) {
    const ret = noCopy ? array : array.slice();

    let high = ret.length - 1;
    let low = 0;
    let mid = 0;

    if (ret.length === 0) {
        ret.push(item);
        return ret;
    }

    while (low <= high) {
        // https://github.com/darkskyapp/binary-search
        // http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
        mid = low + (high - low >> 1);
        const _cmp = compareFunction(ret[mid], item);
        if (_cmp <= 0.0) {
            // searching too low
            low = mid + 1;
        } else {
            // searching too high
            high = mid - 1;
        }
    }

    const cmp = compareFunction(ret[mid], item);
    if (cmp <= 0.0) {
        mid++;
    }

    ret.splice(mid, 0, item);
    return ret;
}