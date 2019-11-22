"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushAtSortPosition = pushAtSortPosition;

/**
 * @link https://github.com/aaditmshah/sorted-array/blob/master/sorted-array.js#L11
 */
function pushAtSortPosition(array, item, compareFunction) {
  array = array.slice();
  var high = array.length - 1;
  var low = 0;
  var pos = -1;
  var index;
  var ordering; // The array is sorted. You must find the position of new element in O(log(n)), not O(n).

  while (high >= low) {
    index = (high + low) / 2 >>> 0;
    ordering = compareFunction(array[index], item);
    if (ordering < 0) low = index + 1;else if (ordering > 0) high = index - 1;else {
      pos = index;
      break;
    }
  }

  if (pos === -1) {
    // if element was not found, high < low.
    pos = high;
  } // This assures that equal elements inserted after will be in a higher position in array.
  // They can be equal for comparison purposes, but different objects with different data.
  // Respecting the chronological order can be important for many applications.


  pos++;
  high = array.length - 1;

  while (pos < high && compareFunction(item, array[pos]) === 0) {
    pos++;
  }

  index = array.length; // Just to increase array size.

  array.push(item); // Much faster. No need to elements swap.

  while (index > pos) {
    array[index] = array[--index];
  } // Set the new element on its correct position.


  array[pos] = item;
  return array;
}