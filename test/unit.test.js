const assert = require('assert');
const AsyncTestUtil = require('async-test-util');
const pushAtSortPosition = require('../').pushAtSortPosition;


const elapsedTime = before => {
    return AsyncTestUtil.performanceNow() - before;
};
let compareCallCount = 0;
function comparator(a, b) {
    compareCallCount = compareCallCount + 1;
    if (a.age > b.age) {
        return 1;
    }
    if (a.age === b.age) {
        return 0;
    }
    if (a.age < b.age) {
        return -1;
    }
}

describe('unit.test.js', () => {
    const generateItem = (age = AsyncTestUtil.randomNumber(1, 10000)) => ({
        name: AsyncTestUtil.randomString(),
        age
    });


    const basicArraySize = 40;
    const basicArray = (size = basicArraySize) => {
        let t = 9;
        return new Array(size).fill(0).map(() => {
            t++;
            return generateItem(t);
        });
    };

    describe('sort correctness', () => {
        it('insert at first', () => {
            const size = 10;
            const before = basicArray(size);
            const position = pushAtSortPosition(
                before,
                generateItem(1),
                comparator,
                0
            );

            assert.strictEqual(position, 0);
            assert.strictEqual(before.length, size + 1);
            assert.strictEqual(before[0].age, 1);
        });
        it('insert at middle', () => {
            const size = 10;
            const items = basicArray(size);

            new Array(size).fill(0).forEach((_v, idx) => {
                pushAtSortPosition(
                    items,
                    generateItem(idx + 200),
                    comparator,
                    0
                )[0];
            });

            const position = pushAtSortPosition(
                items,
                generateItem(100),
                comparator,
                0
            );

            assert.strictEqual(position, size);
            assert.strictEqual(items.length, (size * 2) + 1);
            assert.ok(items.pop().age > 100);
        });
        it('insert at last', () => {
            const size = 10;
            const array = basicArray(size);
            const position = pushAtSortPosition(
                array,
                generateItem(100),
                comparator,
                0
            );

            assert.strictEqual(position, size);
            assert.strictEqual(array.length, size + 1);
            assert.strictEqual(array.pop().age, 100);
        });
        it('should be equal to normal sort', () => {
            const items = new Array(100)
                .fill(0)
                .map(() => generateItem(AsyncTestUtil.randomNumber(10, 1000)));
            const normalSorted = items.slice(0).sort(comparator);

            const own = [];
            items.forEach(item => {
                pushAtSortPosition(
                    own,
                    item,
                    comparator,
                    0
                );
            });
            assert.deepStrictEqual(normalSorted, own);
        });
        it('insert into empty array', () => {
            const array = [];
            const item = generateItem(50);
            const position = pushAtSortPosition(array, item, comparator, 0);
            assert.strictEqual(position, 0);
            assert.strictEqual(array.length, 1);
            assert.strictEqual(array[0], item);
        });
        it('insert into single-element array before', () => {
            const array = [generateItem(100)];
            const item = generateItem(50);
            const position = pushAtSortPosition(array, item, comparator, 0);
            assert.strictEqual(position, 0);
            assert.strictEqual(array.length, 2);
            assert.strictEqual(array[0].age, 50);
            assert.strictEqual(array[1].age, 100);
        });
        it('insert into single-element array after', () => {
            const array = [generateItem(50)];
            const item = generateItem(100);
            const position = pushAtSortPosition(array, item, comparator, 0);
            assert.strictEqual(position, 1);
            assert.strictEqual(array.length, 2);
            assert.strictEqual(array[0].age, 50);
            assert.strictEqual(array[1].age, 100);
        });
        it('insert duplicate values', () => {
            const array = [generateItem(10), generateItem(20), generateItem(30)];
            const item = generateItem(20);
            const position = pushAtSortPosition(array, item, comparator, 0);
            assert.strictEqual(array.length, 4);
            // the duplicate should be adjacent to the other 20
            assert.ok(position >= 1 && position <= 2);
            // array must remain sorted
            for (let i = 0; i < array.length - 1; i++) {
                assert.ok(array[i].age <= array[i + 1].age);
            }
        });
        it('insert all identical values', () => {
            const array = [];
            for (let i = 0; i < 20; i++) {
                pushAtSortPosition(array, generateItem(42), comparator, 0);
            }
            assert.strictEqual(array.length, 20);
            array.forEach(item => assert.strictEqual(item.age, 42));
        });
        it('insert in descending order', () => {
            const array = [];
            for (let i = 100; i >= 1; i--) {
                pushAtSortPosition(array, generateItem(i), comparator, 0);
            }
            assert.strictEqual(array.length, 100);
            for (let i = 0; i < array.length - 1; i++) {
                assert.ok(array[i].age <= array[i + 1].age);
            }
        });
        it('insert in ascending order', () => {
            const array = [];
            for (let i = 1; i <= 100; i++) {
                pushAtSortPosition(array, generateItem(i), comparator, 0);
            }
            assert.strictEqual(array.length, 100);
            for (let i = 0; i < array.length - 1; i++) {
                assert.ok(array[i].age <= array[i + 1].age);
            }
        });
        it('return value always matches actual position', () => {
            const array = [];
            const items = new Array(200)
                .fill(0)
                .map(() => generateItem(AsyncTestUtil.randomNumber(1, 500)));
            items.forEach(item => {
                const position = pushAtSortPosition(array, item, comparator, 0);
                assert.strictEqual(array[position], item);
            });
        });
        it('maintains sort order with negative values', () => {
            const negComparator = (a, b) => {
                if (a.val > b.val) return 1;
                if (a.val === b.val) return 0;
                return -1;
            };
            const array = [];
            const values = [-50, 20, -10, 0, 30, -100, 15, -5, 100, -1];
            values.forEach(v => {
                pushAtSortPosition(array, { val: v }, negComparator, 0);
            });
            for (let i = 0; i < array.length - 1; i++) {
                assert.ok(array[i].val <= array[i + 1].val);
            }
        });
        it('works with string comparator', () => {
            const strComparator = (a, b) => {
                if (a.name > b.name) return 1;
                if (a.name === b.name) return 0;
                return -1;
            };
            const array = [];
            const names = ['banana', 'apple', 'cherry', 'date', 'avocado'];
            names.forEach(name => {
                pushAtSortPosition(array, { name }, strComparator, 0);
            });
            for (let i = 0; i < array.length - 1; i++) {
                assert.ok(array[i].name <= array[i + 1].name);
            }
        });
        it('insert with non-zero low parameter', () => {
            // build sorted array with ages 10..19
            const array = basicArray(10);
            // insert at low=5, item that belongs after index 5
            const item = generateItem(16);
            const position = pushAtSortPosition(array, item, comparator, 5);
            assert.strictEqual(array.length, 11);
            assert.ok(position >= 5);
            assert.strictEqual(array[position].age, 16);
            // verify sort order from low onward
            for (let i = 5; i < array.length - 1; i++) {
                assert.ok(array[i].age <= array[i + 1].age);
            }
        });
        it('insert at every position in a small array', () => {
            // array has ages [10, 11, 12, 13, 14]
            for (let insertAge = 9; insertAge <= 16; insertAge++) {
                const array = basicArray(5);
                const item = generateItem(insertAge);
                const position = pushAtSortPosition(array, item, comparator, 0);
                assert.strictEqual(array.length, 6);
                assert.strictEqual(array[position].age, insertAge);
                for (let i = 0; i < array.length - 1; i++) {
                    assert.ok(array[i].age <= array[i + 1].age);
                }
            }
        });
        it('large random dataset stays sorted', () => {
            const array = [];
            for (let i = 0; i < 1000; i++) {
                pushAtSortPosition(
                    array,
                    generateItem(AsyncTestUtil.randomNumber(1, 10000)),
                    comparator,
                    0
                );
            }
            assert.strictEqual(array.length, 1000);
            for (let i = 0; i < array.length - 1; i++) {
                assert.ok(array[i].age <= array[i + 1].age);
            }
        });
        it('merge sorted arrays with low parameter preserves sort order', () => {
            const base = [];
            for (let i = 0; i < 50; i++) {
                pushAtSortPosition(
                    base,
                    generateItem(AsyncTestUtil.randomNumber(1, 500)),
                    comparator,
                    0
                );
            }
            const toMerge = [];
            for (let i = 0; i < 50; i++) {
                pushAtSortPosition(
                    toMerge,
                    generateItem(AsyncTestUtil.randomNumber(1, 500)),
                    comparator,
                    0
                );
            }
            let lastLow = 0;
            toMerge.forEach(item => {
                lastLow = pushAtSortPosition(base, item, comparator, lastLow);
            });
            assert.strictEqual(base.length, 100);
            for (let i = 0; i < base.length - 1; i++) {
                assert.ok(base[i].age <= base[i + 1].age);
            }
        });
    });
    describe('performance', () => {
        /**
         * Original unoptimized implementation for comparison.
         */
        function pushAtSortPositionOriginal(
            array,
            item,
            compareFunction,
            low
        ) {
            const length = array.length;
            let high = length - 1;
            let mid = 0;
            if (length === 0) {
                array.push(item);
                return 0;
            }
            let lastMidDoc;
            while (low <= high) {
                mid = low + (high - low >> 1);
                lastMidDoc = array[mid];
                if (compareFunction(lastMidDoc, item) <= 0.0) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            if (compareFunction(lastMidDoc, item) <= 0.0) {
                mid++;
            }
            array.splice(mid, 0, item);
            return mid;
        }

        it('should be faster than the original implementation with sequential data', function () {
            this.timeout(20000);

            const amount = 10000;
            const itemsToInsert = basicArray(amount);

            // run original implementation
            const sortedArray1 = [];
            const startTime1 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                pushAtSortPositionOriginal(
                    sortedArray1,
                    item,
                    comparator,
                    0
                );
            });
            const elapsed1 = elapsedTime(startTime1);

            // run optimized implementation
            const sortedArray2 = [];
            const startTime2 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                pushAtSortPosition(
                    sortedArray2,
                    item,
                    comparator,
                    0
                );
            });
            const elapsed2 = elapsedTime(startTime2);

            // verify both produce the same result
            assert.deepStrictEqual(sortedArray1, sortedArray2);

            console.log('--- Sequential data (' + amount + ' items) ---');
            console.log('time for original pushAtSortPosition: ' + elapsed1 + 'ms');
            console.log('time for optimized pushAtSortPosition: ' + elapsed2 + 'ms');
            console.log('speedup: ' + (elapsed1 / elapsed2).toFixed(2) + 'x faster');
        });
        it('should be faster than the original implementation with random data', function () {
            this.timeout(20000);

            const amount = 10000;
            const itemsToInsert = new Array(amount)
                .fill(0)
                .map(() => generateItem(AsyncTestUtil.randomNumber(1, 100000)));

            // run original implementation
            const sortedArray1 = [];
            const startTime1 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                pushAtSortPositionOriginal(
                    sortedArray1,
                    item,
                    comparator,
                    0
                );
            });
            const elapsed1 = elapsedTime(startTime1);

            // run optimized implementation
            const sortedArray2 = [];
            const startTime2 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                pushAtSortPosition(
                    sortedArray2,
                    item,
                    comparator,
                    0
                );
            });
            const elapsed2 = elapsedTime(startTime2);

            // verify both produce the same result
            assert.deepStrictEqual(sortedArray1, sortedArray2);

            console.log('--- Random data (' + amount + ' items) ---');
            console.log('time for original pushAtSortPosition: ' + elapsed1 + 'ms');
            console.log('time for optimized pushAtSortPosition: ' + elapsed2 + 'ms');
            console.log('speedup: ' + (elapsed1 / elapsed2).toFixed(2) + 'x faster');
        });
        it('should use less compare-runs then full sort', () => {
            let c = 0;
            const comparatorCount = (a, b) => {
                c++;
                if (a.age > b.age) {
                    return 1;
                }
                if (a.age === b.age) {
                    return 0;
                }
                if (a.age < b.age) {
                    return 1;
                }
            };
            const array = basicArray();
            pushAtSortPosition(
                array,
                generateItem(100),
                comparatorCount,
                0
            );
            assert.ok(array);
            assert.ok(c < 10);
        });
        it('should be faster then insert-and-sort', function () {
            this.timeout(20000);

            const amount = 3000;

            // run insert-and-sort
            let sortedArray = [];
            const itemsToInsert = basicArray(amount);
            const startTime1 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                sortedArray.push(item);
                sortedArray = sortedArray.sort(comparator);
            });
            const elapsed1 = elapsedTime(startTime1);

            // run pushAtSortPosition
            const sortedArray2 = [];
            const startTime2 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                pushAtSortPosition(
                    sortedArray2,
                    item,
                    comparator,
                    0
                );
            });
            const elapsed2 = elapsedTime(startTime2);

            console.log('time for insert-and-sort: ' + elapsed1 + 'ms');
            console.log('time for pushAtSortPosition: ' + elapsed2 + 'ms');
            assert.ok(elapsed1 > (elapsed2 * 1.1));
        });
        it('merge sorted arrays', function () {
            this.timeout(20000);

            const amount = 80000;

            const baseArray = basicArray(amount).sort(comparator);
            const onTopArray = basicArray(amount).sort(comparator);


            const compareCountBefore = compareCallCount;

            const startTime = performance.now();
            let lastLow = 0;
            let t = 0;
            while (t < amount) {
                const item = onTopArray[t];
                lastLow = pushAtSortPosition(
                    baseArray,
                    item,
                    comparator,
                    lastLow
                ) + 1;
                t++;
            }
            const elapsed = elapsedTime(startTime);
            const compareCounts = compareCallCount - compareCountBefore;
            console.log('time for "merge sorted arrays": ' + elapsed + 'ms');
            console.log('compareCounts: ' + compareCounts);
            // console.dir(baseArray);

        });
    });
});
