const router = require('express').Router()
const { signUp, verifyEmail, login, forgotPassword, resetPassword, authenticateUser, onboarding } = require( '../controllers/user' );
const { authenticate } = require( '../middlewares/authorization' );
const upload = require( '../middlewares/multer' );
const { signUpValidator, verifyEmailValidator, loginValidator, forgotPasswordValidator, onboardingValidator, resetPasswordValidator } = require( '../middlewares/userValidator' );



router.post('/api/auth/register', signUpValidator, signUp)
router.post('/api/auth/verify-email', verifyEmailValidator ,verifyEmail)
router.post('/api/auth/login', loginValidator,login)
router.post('/api/auth/forgot-password', forgotPasswordValidator,forgotPassword)
router.post('/api/auth/reset-password',resetPasswordValidator,resetPassword)
router.get('/api/auth/me', authenticate, authenticateUser)
router.patch('/api/users/onboarding', authenticate, upload.single('profileImage'), onboardingValidator,onboarding)
router.get('/api/users/profile', authenticate, authenticateUser)

module.exports = router 