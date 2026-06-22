const Cart = require("../models/Cart");
const { calculateDiscount } = require("../utilities/promotionEngine");

module.exports.addItem = async (data) => {

    const {
        userId,
        productId,
        productName,
        category,
        price,
        quantity
    } = data;

    // Find user's cart
    let cart = await Cart.findOne({ userId });

    // Create cart if not exists
    if (!cart) {
        cart = await Cart.create({
            userId,
            items: []
        });
    }

    if (!cart?._id) {
        return {
            status: 400,
            message: "Failed to create cart."
        }
    }


    // Check whether product already exists
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {

        // Increase quantity
        existingItem.quantity += quantity;

        // Update latest details
        existingItem.productName = productName;
        existingItem.category = category;
        existingItem.price = price;

    } else {
        cart.items.push({ productId, productName, category, price, quantity });
    }

    const cartData = await cart.save();

    if (!cartData?._id) {
        return {
            status: 400,
            message: "Failed to save item in cart."
        }
    }


    return {
        status: 201,
        message: "Item added in a cart.",
        data: data
    };
};

module.exports.removeItem = async (userId, productId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return {
            status: 404,
            message: "Cart not found."
        };
    }

    // const itemIndex = cart.items.findIndex(item => item.productId === productId);

    // if (itemIndex === -1) {
    //     return {
    //         status: 404,
    //         message: "Item not found in cart."
    //     };
    // }

    // cart.items.splice(itemIndex, 1);

    cart.items = cart.items.filter(item => item.productId !== productId);
    const cartData = await cart.save();


    //const cartData = await cart.save();

    if (!cartData?._id) {
        return {
            status: 400,
            message: "Failed to remove item from cart."
        };
    }

    return {
        status: 200,
        message: "Item removed from cart.",
        data: {
            userId,
            productId,
            items: cartData.items
        }
    };
};

module.exports.checkoutSummary = async (userId) => {

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return {
            status: 404,
            message: "Cart not found."
        }
    }

    let subtotal = 0;

    cart.items.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const categories = new Set(
        cart.items.map(item => item.category)
    );

    const uniqueCategories = categories.size;

    const discountData = calculateDiscount(subtotal, uniqueCategories);

    let totalAmount = subtotal - discountData.totalDiscount;
    const shippingCharge = 100;

    if (totalAmount < 2000) {
        totalAmount = totalAmount + shippingCharge
    }

    return {
        status: 200,
        message: "Total fetched Details",
        data: {
            items: cart.items,
            subtotal,
            uniqueCategories,
            percentageDiscount: discountData.percentageDiscount,
            diversityBonus: discountData.diversityBonus,
            totalDiscount: discountData.totalDiscount,
            finalAmount: totalAmount
        }

    };
};