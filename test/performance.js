const pushAtSortPosition = require('../').pushAtSortPosition;

function comparator(a, b) {
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

function numberComparator(a, b) {
    if (a > b) return 1;
    if (a === b) return 0;
    if (a < b) return -1;
}

function stringComparator(a, b) {
    if (a > b) return 1;
    if (a === b) return 0;
    if (a < b) return -1;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(length) {
    length = length || 10;
    let result = '';
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateItem(age) {
    if (age === undefined) {
        age = randomNumber(1, 10000);
    }
    return {
        name: randomString(),
        age
    };
}

function sequentialArray(size) {
    let t = 9;
    return new Array(size).fill(0).map(() => {
        t++;
        return generateItem(t);
    });
}

function randomArray(size) {
    return new Array(size).fill(0).map(() => generateItem(randomNumber(1, 100000)));
}

function measure(label, fn) {
    const start = performance.now();
    fn();
    const elapsed = performance.now() - start;
    console.log('  ' + label + ': ' + elapsed.toFixed(2) + 'ms');
    return elapsed;
}

function separator() {
    console.log('');
}

console.log('=== pushAtSortPosition Performance Tests ===');
console.log('');

/**
 * 1. Insertion with varying array sizes
 */
console.log('--- Insertion with varying array sizes (random data) ---');
[100, 1000, 10000, 50000].forEach(amount => {
    const items = randomArray(amount);
    measure(amount + ' items', () => {
        const arr = [];
        items.forEach(item => pushAtSortPosition(arr, item, comparator, 0));
    });
});

separator();

/**
 * 2. Sequential vs random data
 */
console.log('--- Sequential vs random data (10,000 items) ---');
const seqItems = sequentialArray(10000);
const randItems = randomArray(10000);

measure('sequential data', () => {
    const arr = [];
    seqItems.forEach(item => pushAtSortPosition(arr, item, comparator, 0));
});
measure('random data', () => {
    const arr = [];
    randItems.forEach(item => pushAtSortPosition(arr, item, comparator, 0));
});

separator();

/**
 * 3. pushAtSortPosition vs insert-and-sort
 */
console.log('--- pushAtSortPosition vs Array.push + Array.sort (3,000 items) ---');
const insertSortItems = randomArray(3000);

const pushAtTime = measure('pushAtSortPosition', () => {
    const arr = [];
    insertSortItems.forEach(item => pushAtSortPosition(arr, item, comparator, 0));
});
const insertSortTime = measure('push + sort', () => {
    const arr = [];
    insertSortItems.forEach(item => {
        arr.push(item);
        arr.sort(comparator);
    });
});
console.log('  speedup: ' + (insertSortTime / pushAtTime).toFixed(2) + 'x faster');

separator();

/**
 * 4. Merging two sorted arrays using the low parameter
 */
console.log('--- Merging two sorted arrays (80,000 + 80,000 items) ---');
const mergeAmount = 80000;
const baseArray = sequentialArray(mergeAmount).sort(comparator);
const onTopArray = sequentialArray(mergeAmount).sort(comparator);

measure('merge with low parameter', () => {
    let lastLow = 0;
    for (let t = 0; t < mergeAmount; t++) {
        lastLow = pushAtSortPosition(baseArray, onTopArray[t], comparator, lastLow) + 1;
    }
});

separator();

/**
 * 5. Number primitives instead of objects
 */
console.log('--- Number primitives (10,000 items) ---');
const numbers = new Array(10000).fill(0).map(() => randomNumber(1, 100000));

measure('number primitives', () => {
    const arr = [];
    numbers.forEach(n => pushAtSortPosition(arr, n, numberComparator, 0));
});

separator();

/**
 * 6. String values
 */
console.log('--- String values (10,000 items) ---');
const strings = new Array(10000).fill(0).map(() => randomString(20));

measure('string values', () => {
    const arr = [];
    strings.forEach(s => pushAtSortPosition(arr, s, stringComparator, 0));
});

separator();

/**
 * 7. Best case: inserting items already in ascending order (always appended at the end)
 */
console.log('--- Best case: ascending insertion order (10,000 items) ---');
const ascItems = sequentialArray(10000);

measure('ascending order (always appends)', () => {
    const arr = [];
    ascItems.forEach(item => pushAtSortPosition(arr, item, comparator, 0));
});

separator();

/**
 * 8. Worst case: inserting items in descending order (always at position 0)
 */
console.log('--- Worst case: descending insertion order (10,000 items) ---');
const descItems = sequentialArray(10000).reverse();

measure('descending order (always splices at 0)', () => {
    const arr = [];
    descItems.forEach(item => pushAtSortPosition(arr, item, comparator, 0));
});

separator();

console.log('=== Performance Tests Complete ===');
