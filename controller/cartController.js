const cartService = require("../services/cartService");
const {sendSuccess, sendError} = require("../Utilities/utils")

module.exports.addItemToCart = async (req, res) => {
    try {
        const result = await cartService.addItem(req.body);

    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

    } catch (error) {
    console.error('Register error:', error.message);
    next(error);
    }
};

module.exports.removeItemFromCart = async (req, res, next) => {
    try {
        const { userId, productId } = req.params;
        const result = await cartService.removeItem(userId, productId);

        if (result?.status === 200 || result?.status === 201) {
            sendSuccess(res, result?.data, result.message, result.status);
        } else {
            sendError(res, result?.message, result?.status, result?.error);
        }
    } catch (error) {
        console.error('Remove item error:', error.message);
        next(error);
    }
};

module.exports.checkout = async (req, res, next) => {

    try {
        const userId = req?.params?.userId
        const result = await cartService.checkoutSummary(userId);

    if(result?.status === 200 || result?.status === 201){
        sendSuccess(res,result?.data, result.message, result.status)
    }else{
        sendError(res,result?.message, result?.status,result?.error) 
    }

    } catch (error) {
    console.error('Register error:', error.message);
    next(error);
    }
};