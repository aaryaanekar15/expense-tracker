const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/Users");
const Expense = require("./models/Expense");
const authMiddleware = require("./middleware/auth");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.set("bufferCommands", false);

const MONGO_URI = "mongodb://aaryaanekar15:aaryaanekar15@ac-srq3vs0-shard-00-00.qc7wmmr.mongodb.net:27017,ac-srq3vs0-shard-00-01.qc7wmmr.mongodb.net:27017,ac-srq3vs0-shard-00-02.qc7wmmr.mongodb.net:27017/expenseDB?ssl=true&replicaSet=atlas-12je4a-shard-0&authSource=admin&appName=Cluster0";

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(" DB connected");

        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });

    } catch (err) {
        console.log(" DB error:", err);
    }
};

startServer();



// Test route
app.get("/", (req, res) => {
    res.send("server is running");
});


// REGISTER
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "user already exists" });
        }

        const hashedpass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedpass
        });

        await newUser.save();

        res.json({ 
            status: "true",
            message: "user registered successfully!" });

    } catch (error) {
        res.json({ error: error.message });
    }
});


// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "user does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: "invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            "secretkey",
            { expiresIn: "1d" }
        );

        res.json({
            message: "login successful",
            token
        });

    } catch (error) {
        res.json({ error: error.message });
    }
});


// ADD EXPENSE
app.post("/add-expense", authMiddleware, async (req, res) => {
    try {
        const { amount, category, date } = req.body;

        if (!amount || !category || !date) {
            return res.json({ message: "All fields are mandatory" });
        }

        const newExpense = new Expense({
            userId: req.userId,
            amount,
            category,
            date
        });

        await newExpense.save();

        res.json({ message: "Expense added successfully" });

    } catch (error) {
        res.json({ error: error.message });
    }
});


// GET EXPENSES
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


// UPDATE EXPENSE
app.put("/update/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, category, date } = req.body;

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { amount, category, date },
            { new: true }
        );

        if (!updatedExpense) {
            return res.json({ message: "error in updating expense" });
        }

        res.json({
            message: "Expense updated",
            updatedExpense
        });

    } catch (error) {
        res.json({ error: error.message });
    }
});


app.get("/total-expense", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });

    const total = expenses.reduce((sum, item) => {
      return sum + Number(item.amount); 
    }, 0);

    res.json({ total });
  } catch (error) {
    res.json({ error: error.message });
  }
});


// FORGOT PASSWORD
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User not found" });
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 min
        await user.save();

        const resetLink = `https://expenses-tracker-aarya.vercel.app/reset-password/${token}`;

        // EMAIL CONFIG
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "aaryaanekar15@gmail.com",
                pass: "vsym rkqv wfte pssd"
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset",
            text: `Click here to reset your password: ${resetLink}`
        });

        res.json({ message: "Reset link sent to email" });

    } catch (error) {
        res.json({ error: error.message });
    }
});


app.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        res.json({ error: error.message });
    }
});


// DELETE EXPENSE
app.delete("/delete/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const deletedExpense = await Expense.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!deletedExpense) {
            return res.json({ message: "error in deleting expense" });
        }

        res.json({ message: "Expense deleted successfully" });

    } catch (error) {
        res.json({ error: error.message });
    }
});