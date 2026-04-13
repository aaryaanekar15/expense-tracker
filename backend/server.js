const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/Users");
const Expense = require("./models/Expense");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");

mongoose.connect("mongodb://aaryaanekar15:aaryaanekar15@ac-srq3vs0-shard-00-00.qc7wmmr.mongodb.net:27017,ac-srq3vs0-shard-00-01.qc7wmmr.mongodb.net:27017,ac-srq3vs0-shard-00-02.qc7wmmr.mongodb.net:27017/?ssl=true&replicaSet=atlas-12je4a-shard-0&authSource=admin&appName=Cluster0")
    .then(() => console.log("✅ DB connected"))
    .catch((err) => console.log("❌ DB error:", err));

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 5000;

app.get(("/"), async (req, res) => {
    res.send("server is running");
});

app.post(("/register"), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ message: "user already exists" })
        }

        const hashedpass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedpass
        });

        await newUser.save();
        res.json({ message: "user registered sucessfully!" })
    }

    catch (error) {
        res.json({ error: error.message });
    }
});


app.post(("/login"), async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "user does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: "invalid credentials" })
        }

        const token = jwt.sign(
            { userId: user._id },
            "secretkey",
            { expiresIn: "1d" }
        )

        res.json({
            message: "Login sucessful",
            token
            
        })

    } catch (error) {
        res.json({ error: error.message });
    }

});

app.post(("/add-expense"), authMiddleware, async (req, res) => {
    try {
        const { amount, category, date } = req.body;

        if (!amount || !category || !date) {
            return res.json({ message: "All fields are mandatory" })
        }
        const newExpense = new Expense({
            userId: req.userId,
            amount,
            category,
            date
        });

        await newExpense.save();

        res.json({ message: "Expense added sucessfully" })
    } catch (error) {
        res.json({ error: error.message });
    }
});


app.get("/expenses", authMiddleware, async (req, res) => {
    try {
        const { category } = req.query;


        let filter = { userId: req.userId };
        if (category) {
            filter.category = category;
        }

        const expenses = await Expense.find(filter);

        res.json(expenses);

    } catch (error) {
        res.json({ error: error.message });
    }
});

app.put(("/update/:id"), authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, date } = req.body;
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { amount, category, date },
            { new: true }
        );
        if (!updatedExpense) {
            return res.json({ message: "error in updating expense"})
        }

        res.json({
            message: "Expense updated",
            updatedExpense
        })
    } catch (error) {
        res.json({ error: error.message })
    }
})

app.delete(("/delete/:id"), authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExpense = await Expense.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!deletedExpense) {
            return res.json({ message: "error in deleting expense" });
        }
        res.json({ message: "Expense deleted sucessfully" })
    } catch (error) {
        res.json({ error: error.message });
    }
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
