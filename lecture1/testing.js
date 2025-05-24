function con(k)
    {
        let number=
        {
            num:2,
            increment:function ()
            {
            return this.num+k;
        },   
    };
        return number;
    }
let c=con(5);
const increment=c.increment();


//map filter reduce
const products = [
  { name: 'Laptop', price: 1200 },
  { name: 'Phone', price: 800 },
  { name: 'Tablet', price: 600 },
  { name: 'Monitor', price: 300 },
  { name: 'Keyboard', price: 100 }
];


const mapExample=products.map(product=>product.name)
mapExample

const filterExample=products.filter(product=>product.price>300 && product.price<800 )
filterExample

const reduceExample=products.reduce((acc,product)=>{
    const total=acc+product.price;
    return total
},0)
reduceExample


//destrucururing
const product = { name: 'Mouse', price: 50 };

const { name, price } = product;
name
price


//spread and rest operators
const users = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 28, email: "charlie@example.com" },
];
const addUser={id:4,name:"John",email:"john@example.com"}

const spreadUser={...users,addUser}
spreadUser


const {email,...rest}=users[0]
rest

const [firstUser, ...otherUsers] = users;
otherUsers


//deep copy shallow copy

const people = [
  { id: 1, name: "Alice", age: 25, email: "alice@example.com"},
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 28, email: "charlie@example.com" },
];

// const copyPeople=[...people]
// const copyPeople=people
const copyPeople = JSON.parse(JSON.stringify(people));

copyPeople[0].name= "Abdullah"
console.log("copyPeople",copyPeople[0].name)
console.log("people",people[0].name)


const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com"
};

// Create a shallow copy
const updatedUser = { ...user, name: "Alicia" };

console.log("User",user.name);        
console.log("Updated User",updatedUser.name);



//for in loop
const person = {fname:"John", lname:"Doe", age:25};

let text = "";
for (let x in person) {
  text += person[x];
  console.log("for in loop",x,person[x])
}


//for of loop
const fruits = ["apple", "banana", "cherry"];
// for (key in object) {
   // code block to be executed
// }
let text1 = "";
for (let x of fruits) {
  text1 += x + " ";
  console.log("for off loop",x)
}