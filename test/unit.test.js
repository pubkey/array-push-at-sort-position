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
