"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushAtSortPosition = pushAtSortPosition;

/**
 * copied and adapted from npm 'binary-search-insert'
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
  /**
   * So we do not have to ghet the ret[mid] doc again
   * at the last we store it here.
   */


  var lastMidDoc;

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