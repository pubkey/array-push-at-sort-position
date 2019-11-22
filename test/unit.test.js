const assert = require('assert');
const AsyncTestUtil = require('async-test-util');
const pushAtSortPosition = require('../').pushAtSortPosition;

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
            return 1;
        }
    };

    const basicArraySize = 40;
    const basicArray = () => {
        let t = 9;
        return new Array(basicArraySize).fill(0).map(() => {
            t++;
            return generateItem(t);
        });
    };

    describe('sort correctness', () => {
        it('insert at first', () => {
            const before = basicArray();
            const after = pushAtSortPosition(
                before,
                generateItem(1),
                comparator
            );
            assert.strictEqual(after.length, basicArraySize + 1);
            assert.strictEqual(after[0].age, 1);
        });
        it('insert at last', () => {
            const before = basicArray();
            const after = pushAtSortPosition(
                before,
                generateItem(100),
                comparator
            );
            assert.strictEqual(after.length, basicArraySize + 1);
            assert.strictEqual(after[0].age, 100);
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
            );
            assert.ok(after);
            assert.ok(c < 10);
        });
    });
    describe('other', () => {
        it('should not have mutated the input', () => {
            const before = basicArray();
            const after = pushAtSortPosition(
                before,
                generateItem(100),
                comparator
            );
            assert.ok(before !== after);
        });
    });

});