// function c() {
//     console.log("C");
// }

// function b() {
//     console.log("B");
//     c();
// }

// function a() {
//     console.log("A");
//     b();
//     console.log("A End");
// }

// a();

// console.log("Finished");


// console.log("A");

// setTimeout(() => {
//     console.log("B");
// }, 0);

// console.log("C");

// console.log("A");

// setImmediate(() => console.log("B"));

// setInterval(() => console.log("C"), 0);

// setImmediate(() => console.log("D"));

// console.log("E");

// console.log("A");

// setTimeout(() => {
//     console.log("Timer");
// }, 0);

// Promise.resolve().then(() => {
//     console.log("Promise");
// });

// console.log("B");

// console.log("Start");

// Promise.resolve().then(() => {
//     console.log("Promise 1");

//     Promise.resolve().then(() => {
//         console.log("Promise 2");
//     });
// });

// setTimeout(() => {
//     console.log("Timer");
// }, 0);

// Promise.resolve().then(() => {
//     console.log("Promise 3");
//     Promise.resolve().then(() => {
//         console.log("Promise 4");
//     });
// });

// console.log("End");

// console.log("Start");

// fetch("https://jsonplaceholder.typicode.com/posts/1")
//     .then((response) => response.json())
//     .then((data) => fetch("https://jsonplaceholder.typicode.com/posts/2"))
//     .then((response) => response.json())
//     .then((data) => console.log(data));

// setTimeout(() => {
//     console.log("Timer");
// }, 200);

// console.log("End");


// let city = "Lahore";

// function first() {

//     function second() {

//         function third() {

//             console.log(city);

//         }

//         third();

//     }

//     second();
// }

// first();

// Closures capture the same counter variable, so every callback increments its latest value when it runs.
// let counter = 0;
// for (let i = 0; i < 5; i++) {
//     setTimeout(() => {
//         counter = counter + 1;
//     }, 1000);
// }
// setInterval(() => {
//     console.log(counter);
// }, 100);

// A closure can access the latest variables, but values computed earlier may become stale.
// function App() {
//     let count = 0;

//     function increment() {
//         count++;
//     }

//     let message = `Count is ${count}`;

//     function log() {
//         setTimeout(() => {
//             console.log(count);
//         }, 3000);
//     }

//     return [increment, log];
// }

// const [increment, log] = App();

// increment();
// increment();
// increment();

// log();

// increment();


//
function outer() {
    let count = 0;

    function log() {
        console.log(count);
    }

    return {
        log,
        increment() {
            count++;
        }
    };
}

const obj = outer();

obj.increment();
obj.increment();

obj.log();
