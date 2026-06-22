const jwt = require("jsonwebtoken");
const {sendError} = require("../Utilities/utils")



module.exports.authenticateUser=async(req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return sendError(res,"No token provided",400)
        }
        const token = authHeader.split(" ")[1];
        const decryptedData = jwt.verify(token,process.env.SECRET_KEY);
        req.user = {id: decryptedData.id, email:decryptedData.email};
        next();

    } catch (error) {
        sendError(res,"Something went wrong!",400, error)
    }
}