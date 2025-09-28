// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

const categories = [
    { id: 1, name: "Furniture" },
    { id: 2, name: "Toys" },
    { id: 3, name: "Clothing" },
];

const items = [
    { id: 1, category: "Furniture", price: 100, name: "Table" },
    { id: 2, category: "Furniture", price: 200, name: "Chair" },
    { id: 3, category: "Furniture", price: 50, name: "Bed" },
    { id: 4, category: "Toys", price: 20, name: "Car" },
    { id: 5, category: "Toys", price: 50, name: "Doll" },
    { id: 6, category: "Clothing", price: 50, name: "Shirt" },
];

const courses = [
    { id: 1, name: "React" },
    { id: 2, name: "Node" },
    { id: 3, name: "MongoDB" },
    { id: 4, name: "Express" },
    { id: 5, name: "Python" },
    { id: 6, name: "Django" },
];

let selectedCourses = [];

let selectedCategory = null;
// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors());
app.get("/category", (req, res) => {
    res.send(categories);
});

app.post("/category", (req, res) => {
    const { name } = req.body;
    const newCategory = { id: categories.length + 1, name };
    categories.push(newCategory);
    res.send(newCategory);
});

app.get("/selectedCategory", (req, res) => {
    res.send(selectedCategory);
});

app.post("/selectedCategory", async (req, res) => {
    const { category } = req.body;
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    selectedCategory = categories.find((c) => c.id === category.id);
    res.send(selectedCategory);
});

app.get("/items/:category", (req, res) => {
    const category = req.params.category;
    const filteredItems = items.filter((item) => item.category === category);
    res.json({ items: filteredItems });
});

app.get("/courses", (req, res) => {
    res.send({ courses, selectedCourses });
});

app.post("/selectCourses", async (req, res) => {
    const apiRandomNumber = Math.random() * 5;
    console.log(apiRandomNumber);
    const { course } = req.body;
    const isSelectedCourse = selectedCourses.find((c) => c.id === course.id);
    await new Promise((resolve, reject) => setTimeout(resolve, apiRandomNumber * 1000));
    if (isSelectedCourse) {
        selectedCourses = selectedCourses.filter((c) => c.id !== course.id);
    } else {
        selectedCourses = [...selectedCourses, course];
    }
    res.send(selectedCourses);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
