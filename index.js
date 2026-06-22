require("dotenv").config();

const express = require("express");
const connectDB = require("./connection/db");
const router = require("./router/index");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();

connectDB();

app.use(express.json());

app.use("/", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "status : OK! running..."
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});