const jwt = require("jsonwebtoken");


module.exports.generateToken =(tokenData)=>{
    return jwt.sign(tokenData,process.env.SECRET_KEY);
}


module.exports.sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

module.exports.sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};