const bcrypt = require("bcrypt")
const { generateToken } = require("../Utilities/utils");
const User = require("../models/user")


module.exports.register = async (payload) => {
    try {
        
        if (!payload.name || !payload.email || !payload.password) {
            return {
                statusCode: 400,
                message: "enter valid data"
            }
        }

        const {name,email,password} = payload;

        const userExist = await User.findOne({email:email, status:"active"});
        if (userExist) {
            return {
                status: 400,
                message: "user already exists.",
                data: null
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);

        userPayload = {
            name : name,
            email: email,
            password: hashPassword
        }
        
        const newUser = await User.insertOne(userPayload);

        if(!newUser?._id) return {
                status: 400,
                message: "Failed to register user.",
                data: null
            }


        const token = generateToken({id: newUser._id,email:newUser.email})
        
        return {
            status: 200,
            message: "You Registered successfully.",
            data: token
        }



    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error?.message
        }
    }
}


module.exports.login = async (payload) => {
    try {
        const { email, password } = payload;

        if (!email || !password) {
            return {
                status: 400,
                message: "enter valid credentials"
            }
        }

        const isExist = await User.findOne({ email: email, status: "active" });
        if (!isExist) {
            return {
                status: 404,
                message: "User not found"
            }
        }

        const validPassword = await bcrypt.compare(password, isExist.password);
        if (!validPassword) {
            return {
                status: 400,
                message: "Invalid Credentials"
            }
        }

        
        const token = generateToken({id: isExist._id,email:isExist.email})      

        return {
            status: 200,
            message: "LoggedIn Successful.",
            data: token
        }


    } catch (error) {
        return {
            status: 500,
            message: "Something went wrong",
            error: error?.message
        }
    }
}