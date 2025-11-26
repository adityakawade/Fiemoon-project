const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    mobile: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        trim: true,
        required: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid Email'
        ]
    },

    password: {
        type: String,
        trim: true,
        required: true,
    }

}, { timestamps: true });


userSchema.pre('save', async function (next) {  //if arrow funtion then this keyword not work

    const count = await model("User").countDocuments({ mobile: this.mobile });
    // checking duplicate mobile
    if (count > 0) {
        throw next(new Error("Mobile number already exist"));
    }

    next();

})


userSchema.pre('save', async function (next) {  //if arrow funtion then this keyword not work

    const count = await model("User").countDocuments({ email: this.email });
    // checking duplicate email
    if (count > 0) {
        throw next(new Error("Email already exist"));
    }

    next();

})


userSchema.pre('save', async function (next) {

    // password encrypt before store
    const encyptedPssword = await bcrypt.hash(this.password.toString(), 12);
    this.password = encyptedPssword;
    console.log(encyptedPssword);
    

    next();
})

const UserModel = model("User", userSchema);

module.exports = UserModel;