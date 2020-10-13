const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;

const User = new Schema({
    name: {
        type: String,
        required: [true, 'specify your name, please'],
        trim: true,
        lowercase: true,
        minlength: [3, 'the name shouldn\'t be shorter than 3 symbols'],
        maxlength: [10, 'the name shouldn\'t be longer than 10 symbols'],
    },
    email: {
        type: String,
        required: [true, 'specify your email, please'],
        validate: [validator.isEmail, 'this email is not valid'],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'specify your password'],
        trim: true,
        minlength: [9, 'password should contain at least 9 symbols']
    },
}, {
    timestamps: true
});

User.methods.generateAuthToken = async function () { // ген токен
    const user = this;
    return jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });

};

User.methods.correctPassword = async function (requestPassword, realPassword) { // при входе
    return await bcrypt.compare(requestPassword, realPassword);
};

User.pre('save', async function (next) { // хэширует пароль перед сейвом или при модификации
    const user = this;

    if(!user.isModified('password')) return next();

    user.password = await bcrypt.hash(user.password, 12);

    next()
});

User.plugin(uniqueValidator);
mongoose.model('users', User);