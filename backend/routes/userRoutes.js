import express from 'express'
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  googleLogin,
  accountActivation,
  forgotPassword,
  resetPassword,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
// import validators
import {
  userSignupValidator,
  userSigninValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.js'
import { runValidation } from '../validators/index.js'

const router = express.Router()

router
  .route('/')
  .post(userSignupValidator, registerUser)
  .get(protect, admin, getUsers)
router.post('/account-activation', accountActivation)
router.route('/login').post(userSigninValidator, authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

// forgot reset password
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  runValidation,
  forgotPassword
)
router.post(
  '/reset-password',
  resetPasswordValidator,
  runValidation,
  resetPassword
)

// google login
router.post('/googlelogin', googleLogin)

export default router
