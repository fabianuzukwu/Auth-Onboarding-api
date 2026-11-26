const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    }, 
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    phoneNumber: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    profileImage: {
        imageId: {
            type: String
        },
        imageUrL: {
            type: String
        }
    }
}, {
    timestamps: true
})

const User = mongoose.model('Users', userSchema)

module.exports = User