# array-push-at-sort-position

Push items to an array at their correct sort-position which is much faster then re-sorting the array.

Adding an item to an array with `push()` and `sort()` has `O(n*log(n))`
while inserting the item at the correct sort-position has `O(n)`.

```bash
  npm install array-push-at-sort-position --save
```

```typescript

// instead of pushing and resorting like this:
const arrayWithItems = arrayWithItems.slice();
arrayWithItems.push(newItem);
const arrayWithNewItems = arrayWithItems.sort(sortComparator);

// you can push the newItem directly into the correct sorting position
const insertPosition = pushAtSortPosition(
  arrayWithItems,
  newItem,
  sortComparator,
  /**
   * Start lowest index
   * Use 0 by default. If you use this method to merge sorted arrays, you might
   * use a  higher value if you know that the newItem will not be positioned before that index.
   */
  0
);
```

### Important

- Calling `pushAtSortPosition` will not copy the array. It will mutate the input array. Call `array.slice(0)` on the input
if you do not want the original array to be mutated.

### See also

I tested many implementations and refactored the best ones. Some other modules:

- [binary-search-insert](https://www.npmjs.com/package/binary-search-insert)
- [sorted-array](https://github.com/aaditmshah/sorted-array/blob/master/sorted-array.js#L11)
