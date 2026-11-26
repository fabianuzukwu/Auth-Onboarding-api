const Joi = require( 'joi' );

exports.signUpValidator = ( req, res, next ) => {
    const userSchema = Joi.object( {
        firstName: Joi.string().trim().regex( /^[a-zA-Z]{3,}$/ ).required().messages( {
            'any.required': 'First Name is Required',
            'string.empty': 'First Name cannot be empty',
            'string.pattern.base': 'First Name must be letters only, at least 3 characters long'
        } ),
        lastName: Joi.string().trim().regex( /^[a-zA-Z]{3,}$/ ).required().messages( {
            'any.required': 'Last Name is Required',
            'string.empty': 'Last Name cannot be empty',
            'string.pattern.base': 'Last Name must be letters only, at least 3 characters long'
        } ),
        email: Joi.string().trim().email().required().messages( {
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address'
        } ),
        password: Joi.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/ ).required().messages( {
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be Empty',
            'string.pattern.base': 'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
        } ),
        confirmPassword: Joi.string().valid( Joi.ref( 'password' ) ).required().messages( {
            'any.only': 'Passwords do not match.',
            'any.required': 'Please confirm your password.',
        } )
    } );

    const { error } = userSchema.validate( req.body );
    if ( error ) {
        return res.status( 400 ).json( {
            message: error.details[ 0 ].message
        } );
    }

    next();
};

exports.verifyEmailValidator = ( req, res, next ) => {
    const bodySchema = Joi.object( {
        email: Joi.string().trim().email().required().messages( {
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address'
        } ),
        otp: Joi.string().trim().regex( /^\d{6}$/ ).required().messages( {
            'any.required': 'OTP is required',
            'string.empty': 'OTP cannot be empty',
            'string.pattern.base': 'OTP must be a 6 digit number.'
        } )
    } );

    const { error } = bodySchema.validate( req.body );
    if ( error ) {
        return res.status( 400 ).json( {
            message: error.details[ 0 ].message
        } );
    }

    next();
};


exports.loginValidator = ( req, res, next ) => {
    const bodySchema = Joi.object( {
        email: Joi.string().trim().email().required().messages( {
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address'
        } ),
        password: Joi.string().required().messages( {
            'any.required': 'Password is required',
        } )
    } );

    const { error } = bodySchema.validate( req.body );
    if ( error ) {
        return res.status( 400 ).json( {
            message: error.details[ 0 ].message
        } );
    }

    next();
};

exports.forgotPasswordValidator = ( req, res, next ) => {
    const bodySchema = Joi.object( {
        email: Joi.string().trim().email().required().messages( {
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email address'
        } ),
    } );

    const { error } = bodySchema.validate( req.body );
    if ( error ) {
        return res.status( 400 ).json( {
            message: error.details[ 0 ].message
        } );
    }

    next();
};

exports.resetPasswordValidaor = ( req, res, next ) => {
    const bodySchema = Joi.object( {
        newPassword: Joi.string().regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/ ).required().messages( {
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be Empty',
            'string.pattern.base': 'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.'
        } ),
        otp: Joi.string().trim().regex( /^\d{6}$/ ).required().messages( {
            'any.required': 'OTP is required',
            'string.empty': 'OTP cannot be empty',
            'string.pattern.base': 'OTP must be a 6 digit number.'
        } )
    } );

    const { error } = bodySchema.validate( req.body );
    if ( error ) {
        return res.status( 400 ).json( {
            message: error.details[ 0 ].message
        } );
    }

    next();

};

exports.onboardingValidator = ( req, res, next ) => {
    const bodySchema = Joi.object( {
        phoneNumber: Joi.string().trim().regex( /^\d{10,}$/ ).required().messages( {
            'any.required': 'Phone number is required.',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must contain only digits and be at least 10 digits long.'
        } ),
        gender: Joi.string().valid( 'Male', 'Female' ).required().messages( {
            'any.required': 'Gender is required.',
            'any.only': 'Gender must be Male or Female.',

        } ),
        dateOfBirth: Joi.date().iso().max( 'now' ).required().messages( {
            'any.required': 'Date of birth is required.',
            'date.base': 'Please enter a valid date of birth.',
            'date.format': 'Date of birth must be in YYYY-MM-DD format.',
            'date.max': 'Date of birth cannot be in the future.',
        } )
    } );

    const { error } = bodySchema.validate( req.body );
    if ( error ) {
        return res.status( 400 ).json( {
            message: error.details[ 0 ].message
        } );
    }

    next();
};