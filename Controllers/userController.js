const userModel = require("../Models/userModel.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const kindergardenModel = require("../Models/kindergardenModel.js")
const schoolModel = require("../Models/schoolModel.js")
const socialChildProjectModel = require("../Models/socialChildProjectModel.js")
const socialTeenagerProjectModel = require("../Models/socialTeenagerProjectModel.js")

exports.signup = async (req, res) => {
    try {

        const user = await userModel.findOne({ email: req.body?.email });

        if ((user) && (user.active == false)) {

            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY, {
                expiresIn: process.env.TOKEN_EXPIRE_IN,
            })

            const hashedPassword = await bcrypt.hash(req.body.pass, 10);

            await userModel.updateOne({ email: user.email }, { $set: { fname: req.body.fname, lname: req.body.lname, mno: req.body.mno, email: req.body.email, pass: hashedPassword, active: true, token: token } }, { new: true })
            //update data with the email id which account is deleted

            res.status(201).json({
                status: true,
                message: "Signup successfully...!",
                data: token,
            });
        }
        else if (user !== null) {
            return res.status(400).json({
                status: false,
                message: "User already exist...!",
            });
        }
        else {
            if (req.body.pass === req.body.cpass) {

                const data = new userModel({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    mno: req.body.mno,
                    pass: req.body.pass
                })

                const token = await data.gentoken();

                await userModel.updateOne({ email: req.body.email }, { $set: { token: token } }, { new: true });


                await data.save();  // password will be bcrypted using function which is define in userModel

                res.status(201).json({
                    status: true,
                    message: "Signup successfully...!",
                    data: token,
                });

            } else {
                res.status(400).json({
                    status: false,
                    message: "Password and confirm password does not match...!",
                });

            }
        }

    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}


exports.signin = async (req, res) => {
    try {
        const data = await userModel.findOne({ email: req.body.email });
        if (data && data.active == true) {
            const valid = await bcrypt.compare(req.body.pass, data.pass);
            if (valid) {
                const token = await data.gentoken();

                await userModel.updateOne({ email: req.body.email }, { $set: { token: token } }, { new: true });

                res.status(200).json({
                    status: true,
                    message: "Signin successfully...!",
                    data: token,
                });

            } else {
                res.status(400).json({
                    status: false,
                    message: "Your detail does not match...!",
                });
            }
        } else {
            res.status(400).json({
                status: false,
                message: "Your account does not exist, Please signup first...!",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
};


exports.fetchUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js

        if (user !== null) {
            return res.status(200).json({
                status: true,
                data: user,
            });
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
};


exports.editProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js

        if (user !== null) {

            await userModel.updateOne({ email: user.email }, { $set: { fname: req.body.fname, lname: req.body.lname, mno: req.body.mno, email: req.body.email } }, { new: true })

            res.status(200).json({
                status: true,
                message: "Your details have been updated..!!"
            })
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        console.log("Error while fetching user:", error);
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js

        if (user !== null) {

            await userModel.updateOne({ email: user.email }, { $set: { active: req.body.active } }, { new: true })

            res.status(200).json({
                status: true,
                message: "Your account has been deleted..!!"
            })
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        console.log("Error while fetching user:", error);
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
};


exports.addFavFacility = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js
        const userId = user._id

        if (user !== null) {
            if (req.body.category == "School") {
                const favFacility = await schoolModel.findById(req.body.id)
                await userModel.findByIdAndUpdate(userId, { $set: { favFacility: favFacility } })

                res.status(200).json({
                    status: true,
                    message: "Favourite facility has been added to your account..!!"
                })
            }


            if (req.body.category == "Social child project") {

                const favFacility = await socialChildProjectModel.findById(req.body.id)
                await userModel.findByIdAndUpdate(userId, { $set: { favFacility: favFacility } })

                res.status(200).json({
                    status: true,
                    message: "Favourite facility has been added to your account..!!"
                })
            }


            if (req.body.category == "Kindergarden") {
                const favFacility = await kindergardenModel.findById(req.body.id)
                await userModel.findByIdAndUpdate(userId, { $set: { favFacility: favFacility } })

                res.status(200).json({
                    status: true,
                    message: "Favourite facility has been added to your account..!!"
                })
            }


            if (req.body.category == "Social teenager project") {
                const favFacility = await socialTeenagerProjectModel.findById(req.body.id)
                await userModel.findByIdAndUpdate(userId, { $set: { favFacility: favFacility } })

                res.status(200).json({
                    status: true,
                    message: "Favourite facility has been added to your account..!!"
                })
            }
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        console.log("Error while fetching user:", error);
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
}


exports.fetchFavFacility = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js

        if (user !== null) {

            await userModel.findOne({})

            return res.status(200).json({
                status: true,
                data: user,
            });
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
};

exports.removeFavFacility = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js

        if (user !== null) {
            const userId = user?._id
            await userModel.findByIdAndUpdate(userId, { $set: { favFacility: {} } })

            return res.status(200).json({
                status: true,
                message: "Favourite facility has been removed from your account..!!",
            });
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
};

exports.addHomeAddress = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id); //get from auth.js
        const userId = user._id
        console.log(user);
        console.log(req.body.homeAddress);
        if (user !== null) {
            if (req.body.homeAddress) {

                await userModel.findByIdAndUpdate(userId, { $set: { homeAddress: req.body.homeAddress } })
                return res.status(200).json({
                    status: true,
                    message: "Home Address has been added to your account..!!",
                });
            } else {
                console.log("Error while adding home address:", error);
                res.status(400).json({
                    status: false,
                    message: "Something went wrong, Please try again latter...!",
                });
            }
        } else {
            return res.status(401).json({
                status: false,
                message: "Invalid user id",
            });
        }
    } catch (error) {
        console.log("Error while adding home address:", error);
        res.status(400).json({
            status: false,
            message: "Something went wrong, Please try again latter...!",
        });
    }
}