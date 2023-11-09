const errorHandler = require("../helpers/errorHandler.helper")
const profileModel = require("../models/profile.model")
const userModel = require("../models/user.model")
const argon = require("argon2")


exports.getProfileById = async (req, res) => {
    try {
        const profileId = req.params.id;

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: "Profile ID is missing. Please provide a valid ID."
            });
        }

        const profile = await profileModel.findOne(profileId);

        if (!profile) {
            return res.json({
                success: false,
                message: "Profile not found!"
            });
        }

        return res.json({
            success: true,
            message: "Profile",
            results: profile
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the profile."
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const {id} = req.user
        const profile = await profileModel.findOneUserId(id)
        if(!profile){
            return res.json({
                success:false,
                message:"profile_not_found"
            })
        }
        return res.json({
            success: true,
            message: "Profile",
            results: profile
        })
    } catch (error) {
        return errorHandler(res, error)
    }
}

