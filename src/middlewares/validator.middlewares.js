const { body, validationResult } = require("express-validator")

const userName = body("userName").isLength({ min: 3, max: 80 }).withMessage("userName is invalid");
// const strongPassword = body("password").isStrongPassword().withMessage("Password Error")

const rules = {
    authLogin: [
        userName
    ],
    createUser: [
        body("username").isLength({min: 3, max: 80}).withMessage("Name length is invalid"),
        userName
    ],
    resetPassword:[
        body("confirmPassword").custom((value, {req}) => {
            return value === req.body.password
        }).withMessage("confirm password does not match")
    ]
}

const validator = (request, response, next) => {
    const errors = validationResult(request)
    try{
        if(!errors.isEmpty()) {
            throw Error("validation")
        }
        return next()
    }catch(err){
        return response.status(400).json({ 
            success: false,
            message: "Validation Error",
            results: errors.array()
        })
    }
}
const validate = (selectedRules) => [rules[selectedRules], validator]

module.exports = validate
