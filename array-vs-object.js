/**
 * A test to check if it is faster to 
 * create and acess an array with 2 elements
 * or an object with 2 properties.
 * The output of this test determines
 * the return type of pushAtSortPosition()
 */


const pos = 23;
const ar = new Array(100).fill(0).map(() => ({
    a: new Date().getTime(),
    b: new Date().getTime(),
    c: new Date().getTime(),
}));

function getArray() {
    return [ar, pos];
}
function getObject() {
    return {
        array: ar,
        position: pos
    };
}


const totalRuns = 1000;
let done = 0;
let totalAr = 0;
let totalObj = 0;
while (done < totalRuns) {
    done++;

    const runs = 10000000;
    let t = 0;
    let time = performance.now();

    if (done % 2 === 0) {
        // test object
        time = performance.now();
        t = 0;
        while (t < runs) {
            t++;
            getObject().array;
            getObject().postition;
        }
        time = performance.now() - time;
        totalObj = totalObj + time;

        // test array
        time = performance.now();
        t = 0;
        while (t < runs) {
            t++;
            getArray()[0];
            getArray()[1];
        }
        time = performance.now() - time;
        totalAr = totalAr + time;
    } else {
        // test array
        time = performance.now();
        t = 0;
        while (t < runs) {
            t++;
            getArray()[0];
            getArray()[1];
        }
        time = performance.now() - time;
        totalAr = totalAr + time;

        // test object
        time = performance.now();
        t = 0;
        while (t < runs) {
            t++;
            getObject().array;
            getObject().postition;
        }
        time = performance.now() - time;
        totalObj = totalObj + time;
    }




}

console.log('totalAr: ' + totalAr);
console.log('totalObj: ' + totalObj);
