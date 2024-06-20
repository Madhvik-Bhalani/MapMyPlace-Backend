const mongoose = require("mongoose");
const unival = require("mongoose-unique-validator")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "Please fill your first name"],
    },
    lname: {
        type: String,
        required: [true, "Please fill your last name"],
    },
    email: {
        type: String,
        required: [true, " Please fill your email"],
        unique: true,
        lowercase: true,

        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error("Email is not valid");
            }
        }
    },
    mno: {
        type: String,
        trim: true,
        required: [true, " Please fill your mobile number"],
        validate(val) {
            const mobileNumber = val.toString();
            if (mobileNumber.length !== 11) {
                throw new Error("Mobile number must be 11 digits");
            }
            if (mobileNumber.startsWith("0")) {
                throw new Error("Mobile number must not start with 0");
            }

        },
        unique: [true, "Mobile number must be unique"],
    },
    favFacility: {
        type: Object
    },
    homeAddress: {
        type: Object
    },
    pass: {
        type: String,
        required: [true, "Please fill your password"],
    },
    token: {
        type: String
    },
    active: {
        type: Boolean,
        default: true,
    }
},
    { timestamps: true }
);
userSchema.plugin(unival)

// encrypt password before save
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("pass")) {
            const hashedPassword = await bcrypt.hash(this.pass, 10);
            this.pass = hashedPassword;
        }
        next();
    } catch (error) {
        console.error("Password hashing error:", error);
        next(error);
    }
});

//generate json web token for user
userSchema.methods.gentoken = async function () {

    try {
        const token = await jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRE_IN,
        })
        return token;
    } catch (error) {

        console.log(`json web token generate err` + error);
    }
}

module.exports = mongoose.model("User", userSchema, "users");