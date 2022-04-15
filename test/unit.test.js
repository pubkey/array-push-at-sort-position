const assert = require('assert');
const AsyncTestUtil = require('async-test-util');
const pushAtSortPosition = require('../').pushAtSortPosition;


const elapsedTime = before => {
    return AsyncTestUtil.performanceNow() - before;
};

describe('unit.test.js', () => {
    const generateItem = (age = AsyncTestUtil.randomNumber()) => ({
        name: AsyncTestUtil.randomString(),
        age
    });

    const comparator = (a, b) => {
        if (a.age > b.age) {
            return 1;
        }
        if (a.age === b.age) {
            return 0;
        }
        if (a.age < b.age) {
            return -1;
        }
    };

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
            const ret = pushAtSortPosition(
                before,
                generateItem(1),
                comparator
            );

            assert.strictEqual(ret.position, 0);
            assert.strictEqual(ret.array.length, size + 1);
            assert.strictEqual(ret.array[0].age, 1);
        });
        it('insert at middle', () => {
            const size = 10;
            let items = basicArray(size);

            new Array(size).fill(0).forEach((_v, idx) => {
                items = pushAtSortPosition(
                    items,
                    generateItem(idx + 200),
                    comparator
                ).array;
            });

            const ret = pushAtSortPosition(
                items,
                generateItem(100),
                comparator
            );

            assert.strictEqual(ret.position, size);
            assert.strictEqual(ret.array.length, (size * 2) + 1);
            assert.ok(ret.array.pop().age > 100);
        });
        it('insert at last', () => {
            const size = 10;
            const before = basicArray(size);
            const ret = pushAtSortPosition(
                before,
                generateItem(100),
                comparator
            );

            assert.strictEqual(ret.position, size);
            assert.strictEqual(ret.array.length, size + 1);
            assert.strictEqual(ret.array.pop().age, 100);
        });
        it('should be equal to normal sort', () => {
            const items = new Array(10)
                .fill(0)
                .map(() => generateItem(AsyncTestUtil.randomNumber(10, 1000)));
            const normalSorted = items.sort(comparator);
            let own = [];
            items.forEach(item => {
                own = pushAtSortPosition(
                    own,
                    item,
                    comparator
                ).array;
            });
            assert.deepStrictEqual(normalSorted, own);
        });
    });
    describe('performance', () => {
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
            const before = basicArray();
            const after = pushAtSortPosition(
                before,
                generateItem(100),
                comparatorCount
            ).array;
            assert.ok(after);
            assert.ok(c < 10);
        });
        it('should be faster then insert-and-sort', () => {
            const amount = 1000;

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
            let sortedArray2 = [];
            const startTime2 = AsyncTestUtil.performanceNow();
            itemsToInsert.forEach(item => {
                sortedArray2 = pushAtSortPosition(
                    sortedArray2,
                    item,
                    comparator
                ).array;
            });
            const elapsed2 = elapsedTime(startTime2);

            console.log('time for insert-and-sort: ' + elapsed1 + 'ms');
            console.log('time for pushAtSortPosition: ' + elapsed2 + 'ms');
            assert.ok(elapsed1 > (elapsed2 * 1.1));
        });
    });
    describe('other', () => {
        it('should not have mutated the input', () => {
            const before = basicArray();
            const after = pushAtSortPosition(
                before,
                generateItem(100),
                comparator
            ).array;
            assert.ok(before !== after);
        });
        it('should only mutate the input when noCopy set', () => {
            const before = basicArray();
            const after = pushAtSortPosition(
                before,
                generateItem(100),
                comparator,
                true
            ).array;
            assert.ok(before === after);
        });
    });

});
