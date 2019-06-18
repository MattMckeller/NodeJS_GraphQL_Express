const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TaskModel = require('./task-model');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age can not be negative');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [7, 'Password does not meet the minimum length requirements'],

    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
}, {
    timestamps: true,
});

userSchema.statics.findByCredentials = async (email, password) => {
    if (!typeof email === 'string') {
        throw new Error('Email should be a string');
    }

    email = email.toLowerCase();
    const user = await UserModel.findOne({email});

    if (!user) {
        throw new Error('Unable to login.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login.');
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
};

// Called when sending model back through response, i.e. when JSON.stringify is called
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// Reference to the task model, this field is not actually stored in the user collection in the database.
// This is setup for mongoose to know what is related and who owns what
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

// Needs to be regular func not arrow due to this binding
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
});

// Delete all user task when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    await TaskModel.deleteMany({owner: user._id});
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
