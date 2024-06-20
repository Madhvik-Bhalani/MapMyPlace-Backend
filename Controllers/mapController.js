const kindergardenModel = require("../Models/kindergardenModel.js")
const schoolModel = require("../Models/schoolModel.js")
const socialChildProjectModel = require("../Models/socialChildProjectModel.js")
const socialTeenagerProjectModel = require("../Models/socialTeenagerProjectModel.js")
const userModel = require("../Models/userModel.js")


exports.fetchMapData = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js

        if (user !== null) {

            const schoolsData = await schoolModel.find()
            const socialChildProjectsData = await socialChildProjectModel.find()
            const socialTeenagerProjectsData = await socialTeenagerProjectModel.find()
            const kindergartensData = await kindergardenModel.find()
    
            return res.status(200).json({
                status: true,
                data: {
                    "schools": schoolsData,
                    "childProjects": socialChildProjectsData,
                    "teenagerProjects": socialTeenagerProjectsData,
                    "kinderGardens": kindergartensData,
                },
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid user id..!!",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter..!",
        });
    }
};



