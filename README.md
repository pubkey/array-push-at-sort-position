# array-push-at-sort-position

Push items to an array at their correct sort-position which is much faster then re-sorting the array.

Adding an item to an array with `push()` and `sort()` has `O(log(n))`
while inserting the item at the correct sort-position has `O(n)`.

```bash
  npm install array-push-at-sort-position --save
```

```typescript

// instead of pushing and resorting like this:
const arrayWithNewItems = arrayWithItems.slice();
arrayWithNewItems.push(newItem);
arrayWithNewItems = arrayWithNewItems.sort(sortComparator);

// you can push the newItem directly into the correct sorting position
const arrayWithNewItems = pushAtSortPosition(
  arrayWithItems,
  newItem,
  sortComparator
);
```

### See also

I tested many implementations and refactored the best ones. Some other modules:

- [binary-search-insert](https://www.npmjs.com/package/binary-search-insert)
- [sorted-array](https://github.com/aaditmshah/sorted-array/blob/master/sorted-array.js#L11)