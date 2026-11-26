const User = require( '../models/user' );
const bcrypt = require( 'bcrypt' );
const otp_generator = require( 'otp-generator' );
const jwt = require( 'jsonwebtoken' );
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

exports.signUp = async ( req, res ) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        const user = await User.findOne( { email: email.toLowerCase() } );
        if ( user ) {
            return res.status( 400 ).json( {
                message: 'User already exist'
            } );
        }

        const saltedRounds = await bcrypt.genSalt( process.env.BCRYPT_SALT_ROUNDS );
        const hashPassword = await bcrypt.hash( password, saltedRounds );
        const otp = otp_generator.generate( 6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false } );

        if ( password !== confirmPassword ) {
            return res.status( 400 ).json( {
                message: 'Confirm Password does not match'
            } );
        }
        const data = {
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashPassword,
            otp
        };

        const newUser = new User( data );
        await newUser.save();

        const fullName = `${ newUser.firstName } ${ newUser.lastName }`;
        const emailContent = {
            name: fullName,
            subject: 'Welcome to UNCLE FAB UNIVERSE',
            email,
            htmlContent: `<html><head></head><body><p>Hello ${ fullName },</p>We are thrilled to have you onboard, Please use the OTP below to verify your account. <br> ${ otp } </p></body></html>`
        };

        await sendEmail( emailContent );

        res.status( 201 ).json( {
            message: 'Successful Signup',
            data: newUser
        } );
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        } );
    }
};

exports.verifyEmail = async ( req, res ) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne( { email: email.toLowerCase() } );
        if ( !user ) {
            return res.status( 404 ).json( {
                message: 'User not found'
            } );
        }

        if ( user.otp !== otp ) {
            return res.status( 400 ).json( {
                message: 'Invalid OTP'
            } );
        }

        user.emailVerified = true;
        user.otp = null;

        await user.save();

        res.json( 200 ).json( {
            message: 'Email verified Successfuly',
            data: user
        } );
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        } );
    }
};

exports.login = async ( req, res ) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne( { email: email.toLowerCase() } );
        if ( !user ) {
            return res.status( 404 ).json( {
                message: 'User not found'
            } );
        }

        const isPasswordCorrect = await bcrypt.compare( password, user.password );

        if ( isPasswordCorrect == false ) {
            return res.status( 400 ).json( {
                message: 'Incorrect Password'
            } );
        }

        if ( user.emailVerified == false ) {
            return res.status( 400 ).json( {
                message: "User not verified, please check your email for the OTP sent to you."
            } );
        }

        const token = await jwt.sign( {
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: process.env.OTP_EXPIRY_MINUTES } );

        res.status( 200 ).json( {
            message: 'Login Successful',
            data: user,
            token
        } );
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        } );
    }
};

exports.forgotPassword = async ( req, res ) => {
    try {
        const { email } = req.body;
        const user = await User.findOne( { email: email.toLowerCase() } );
        if ( !user ) {
            return res.status( 404 ).json( {
                message: 'User not found'
            } );
        }

        const otp = otp_generator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})

        const fullName = `${user.firstName} ${user.lastName}`
        const emailContent = {
            subject: 'Password Reset',
            name: fullName,
            email,
            htmlContent: `<html><head></head><body><p>Hello ${fullName},</p>Your password reset was initialized, below is your OTP. If you did not initiate this request, please disregard this email <br> ${otp} </p></body></html>`

        }

        user.otp = otp
        await sendEmail(emailContent)
        await user.save()

        res.status(200).json({
            message: "Forgot Password is successful, Please check your email for the OTP"
        })
    } catch ( error ) {
        res.status( 500 ).json( {
            message: error.message
        } );
    }
};

exports.resetPassword = async(req, res) => {
    try {
       const  {otp, newPassword} = req.body

        if (user.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            })
        }

        const saltedRounds = await bcrypt.genSalt(process.env.BCRYPT_SALT_ROUNDS)
        const hashPassword = await bcrypt.hash(newPassword, saltedRounds)

        user.password = hashPassword
        user.otp = null
        await user.save()

        res.status(200).json({
        message: 'Password reset successful'
       })
    } catch (error) {
         res.status( 500 ).json( {
            message: error.message
        } );
    }
}

exports.authenticateUser = async (req, res) => {
    try {
        const { id } = req.user
        
        const user = await User.findById(id)
        if(!user){
          return res.status(401).json({
            mesaage: 'Please login to continue'
          })
        }

        const authenticatedUser = {
            firstName:user.firstName, lastName:user.lastName, email, gender, dateOfBirth, emailVerified
        }

        res.status(200).json({
            message: 'User Found',
            data: authenticatedUser
        })
    } catch (error) {
         res.status( 500 ).json( {
            message: error.message
        } );
    }
}

exports.onboarding = async(req, res) => {
    try {
        const { id } = req.user
        const {phoneNumber, gender, dateOfBirth} = req.body
        const file = req.file
        const user = await User.findById(id)

        if (!user) {
           return res.status(401).json({
            message: 'Please Login to continue.'
           })
        }

        if (user.onboarded == true) {
            return res.status(400).json({
                message: 'Onboarding Already Completed'
            })
        }

        if (file) {
            const result = await cloudinary.uploader.upload(file.path, (error, data) => {
                if (error) {
                    fs.unlinkSync(file.path)
                    return res.status(500).json({
                        message: 'Failed to Upload File' + error.message
                    })
                } else {
                    return data
                }
            })

            user.profileImage = {
                imageId: result.public_id,
                imageUrl: result.secure_url
            }

        }

        user.gender = gender
        user.phoneNumber = phoneNumber
        user.dateOfBirth = dateOfBirth
        user.isOnboarded = true

        await user.save()
        
        fs.unlinkSync(file.path)
        const onboaredUser = {
            firstName: user.firstName, lastName: user.lastName, email, gender, dateOfBirth, emailVerified
        }
        res.status(200).json({
            message: 'User Onboarding Completed Successfully',
            data: onboaredUser
        })
    } catch (error) {
        if (error) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
        }
        res.status( 500 ).json( {
            message: error.message
        } );
    }
}