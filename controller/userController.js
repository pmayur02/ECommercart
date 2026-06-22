const userService = require("../Services/userService");
const {sendSuccess, sendError} = require("../Utilities/utils")

module.exports.registerUser= async (req, res, next) => {
  try {

    const result = await userService.register(req.body);
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

module.exports.login= async (req, res, next) => {
  try {

    const result = await userService.login(req.body);
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