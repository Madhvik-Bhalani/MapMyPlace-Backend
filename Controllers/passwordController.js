const userModel = require("../Models/userModel.js")
const passTokenModel = require("../Models/passTokenModel.js")
const bcrypt = require("bcryptjs")
const crypto = require('crypto');
const nodeMailer = require("../Services/NodeMailer.js");


exports.forgotPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body?.email });

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User with given email does not exist..!!",
            });;
        }

        // Function to generate a random token
        function generateToken() {
            return crypto.randomBytes(32).toString('hex');
        }

        // Generate a secure random token and set an expiration time
        const token = await bcrypt.hash(generateToken(), 10);

        const expiresAt = Date.now() + 3600000; // Token expires in 1 hour

        // Store token in the database
        await new passTokenModel({ email: user.email, token, expiresAt }).save();

        // Create the reset link with the token
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        nodeMailer("resetPassword", user.email, "", `${user.fname} ${user.lname}`, resetLink);

        return res.status(200).json({
            status: true,
            message: "Password reset link has been sent..!!",
        });;


    } catch (error) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
};


exports.resetPassword = async (req, res) => {
    try {

        const { token, pass } = req.body;

        const storedTokenData = await passTokenModel.findOne({ token });

        if (!storedTokenData) {
            return res.status(400).json({
                status: false,
                message: "Invalid token..!!",
            });;
        }

        if (storedTokenData.expiresAt < Date.now()) {
            return res.status(400).json({
                status: false,
                message: "Token has expired..!!",
            });;
        }

        const newPassword = await bcrypt.hash(pass, 10);

        await userModel.updateOne({ email: storedTokenData.email }, { $set: { pass: newPassword } }, { new: true });

        await passTokenModel.deleteOne({ token }); // delete that token 

        return res.status(200).json({
            status: true,
            message: "Password reset successfully..!!",
        });;

    }
    catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });;
    }

};


// 4.change password
exports.changePassword = async (req, res) => {
    try {
        data = await userModel.findOne({ _id: req.user._id })

        valid = await bcrypt.compare(req.body.opass, data.pass)
        if (valid) {
            if (req.body.npass === req.body.rpass) {
                newpass = await bcrypt.hash(req.body.npass, 10)
                udata = await userModel.updateOne({ email: data.email }, { $set: { pass: newpass } })
                res.status(200).json({
                    status: true,
                    message: "Your password has been changed..!!",
                });;
            }
            else {
                res.status(400).json({
                    status: false,
                    message: "New password and re-type password are not match",
                });;
            }
        } else {
            res.status(400).json({
                status: false,
                message: "Old password does not match",
            });;
        }
    } catch (e) {
        res.status(400).json(e.message)

    }
}
