const userModel = require("../models/user.model")
const profileModel = require("../models/profile.model")
const errorHandler = require("../helpers/errorHandler.helper")
const jwt = require("jsonwebtoken")
const argon = require("argon2")
const {APP_SECRET} = process.env

exports.login = async (request, response) => {
    try{
        const {userName, password} = request.body
        const user = await userModel.findOneByUserName(userName)
        if(!user){
            throw Error("wrong_credentials")
        }
        const verify = await argon.verify(user.password, password)
        if(!verify){
            throw Error("wrong_credentials")
        }
        const token = jwt.sign({id: user.id, role: user.role}, APP_SECRET)
        return response.json({
            success: true,
            message: "Login Success!",
            results: {token} 
        })
    }catch(err){
        return errorHandler(response, err)
    }
}

exports.register = async(request, response) => {
    try{
        const {password} = request.body

        const hash = await argon.hash(password)
        const companyHr = 3
        const data = {
            ...request.body,
            password: hash,
            roleId: companyHr,
        }
        
        const user = await userModel.insert(data)
        const profileData = {
            userId: user.id,
        };

        await profileModel.insert(profileData);
        const token = jwt.sign({id: user.id, role: user.role}, APP_SECRET)
        return response.json({
            success: true,
            message: "Register Success!",
            results: {token} 
        })
    }catch(err){
        console.log(err)
    }
}
