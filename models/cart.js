const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            enum: ["electronics", "beauty","clothes","groceries","footwear","other"],
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        items: [itemSchema]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Cart", cartSchema);