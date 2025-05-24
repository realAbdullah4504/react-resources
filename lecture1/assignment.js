// Map, Filter, and Reduce

const users = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 28, email: "charlie@example.com" },
  { id: 4, name: "David", age: 35, email: "david@example.com" }
];

// 1. Use map() to return an array of just names.
const names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob", "Charlie", "David"]

// 2. Use filter() to return users older than 28.
const olderThan28 = users.filter(user => user.age > 28);
console.log(olderThan28); 
// [{ id: 2, name: "Bob", ... }, { id: 4, name: "David", ... }]


// Destructuring
// 3. Use reduce() to return the average age of users.
const averageAge = users.reduce((acc, user) => acc + user.age, 0) / users.length;
console.log(averageAge); // 29.5


// 1. Destructure the name and email from a user object
const user = { id: 1, name: "Alice", age: 25, email: "alice@example.com" };
const { name, email } = user;
console.log(name);  // Alice
console.log(email); // alice@example.com

// 2. Use array destructuring to extract the first and second items
const fruits = ["apple", "banana", "cherry", "mango"];
const [first, second] = fruits;
console.log(first);  // apple
console.log(second); // banana


// Spread and Rest Operators
// 1. Add an element to the beginning of fruits using the spread operator
const newFruits = ["pineapple", ...fruits];
console.log(newFruits); 
// ["pineapple", "apple", "banana", "cherry", "mango"]

// 2. Function using rest parameters to sum any number of arguments
function sumAll(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sumAll(1, 2, 3, 4)); // 10


// Shallow vs Deep Copy

const person = {
  name: "John",
  address: {
    city: "New York",
    zip: 10001
  }
};

// 1. Shallow Copy
const shallowCopy = { ...person };
shallowCopy.address.city = "Los Angeles";
console.log(person.address.city); 
// Output: "Los Angeles" — because it's a shallow copy, nested objects are still referenced

// 2. Deep Copy
const deepCopy = JSON.parse(JSON.stringify(person));
deepCopy.address.city = "Chicago";
console.log(person.address.city); 
// Output: "Los Angeles" — deep copy does not affect the original object
