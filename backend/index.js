// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

const buttons = [
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

let selectedButton = null;
// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors());
app.get("/category", (req, res) => {
    res.send(buttons);
});

app.post("/category", (req, res) => {
    const { name } = req.body;
    const newButton = { id: buttons.length + 1, name };
    buttons.push(newButton);
    res.send(newButton);
});

app.get("/selectedButton", (req, res) => {
    res.send(selectedButton);
});

app.post("/selectedButton", async (req, res) => {
    const { id } = req.body;
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    selectedButton = buttons.find((button) => button.id === id);
    res.send(selectedButton);
});

app.get("/items/:category", (req, res) => {
    const category = req.params.category;
    const filteredItems = items.filter((item) => item.category === category);
    res.json({ items: filteredItems });
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
