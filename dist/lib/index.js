"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushAtSortPosition = pushAtSortPosition;

/**
 * copied from npm 'binary-search-insert'
 * @link https://www.npmjs.com/package/binary-search-insert
 */
function pushAtSortPosition(array, item, compareFunction, noCopy) {
  var ret = noCopy ? array : array.slice(0);
  var high = ret.length - 1;
  var low = 0;
  var mid = 0;
  /**
   * Optimization shortcut.
   */

  if (ret.length === 0) {
    ret.push(item);
    return [ret, 0];
  }

  while (low <= high) {
    // https://github.com/darkskyapp/binary-search
    // http://googleresearch.blogspot.com/2006/06/extra-extra-read-all-about-it-nearly.html
    mid = low + (high - low >> 1);

    var _cmp = compareFunction(ret[mid], item);

    if (_cmp <= 0.0) {
      // searching too low
      low = mid + 1;
    } else {
      // searching too high
      high = mid - 1;
    }
  }

  var cmp = compareFunction(ret[mid], item);

  if (cmp <= 0.0) {
    mid++;
  }

  ret.splice(mid, 0, item);
  return [ret, mid];
}