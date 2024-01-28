const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
const PORT = 5000;
dotenv.config();

app.use(express.json());

// Database
try {
    mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
} catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the application if unable to connect to MongoDB
}

app.use("/api/users", require("./routes/User.js"));

// Middleware to handle errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message;

    res.status(statusCode).json({
        success: false,
        statusCode,
        message: errorMessage,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
