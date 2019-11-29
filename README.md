# array-push-at-sort-position

Push items to an array at their correct sort-position which is much faster then re-sorting the array.

```bash
  npm install array-push-at-sort-position --save
```

```typescript

// instead of pushing a re-sorting like this:
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

Basically this is a standalone version of the insert-function from [this module](https://github.com/aaditmshah/sorted-array/blob/master/sorted-array.js#L11) of [Aadit M Shah](https://github.com/aaditmshah)
