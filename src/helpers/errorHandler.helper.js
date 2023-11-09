const errorHandler = (response, error) => {

    if (error?.message?.includes("duplicate key")) {
        return response.status(409).json({
            success: false,
            message: "Error: Email already exist !"
        })
    }

    if (error?.message?.includes("please_sign_in")) {
        console.log(error)
        return response.status(401).json({
            success: false,
            message: "Please login to create events"
        })
    }
    if (error?.message?.includes("wrong_credentials")) {
        return response.status(401).json({
            success: false,
            message: "The data you entered is incorrect!"
        })
    }
}

module.exports = errorHandler