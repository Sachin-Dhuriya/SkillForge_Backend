import express from 'express';
const router = express.Router();
import {registerUser, loginUser, userProfile, logoutUser} from '../controllers/authController.js'
import authenticate from '../../middlewares/authMiddleware.js';

router.post('/register',registerUser)
router.post('/login', loginUser)
router.get('/profile',authenticate,userProfile)
router.get('/logout', authenticate, logoutUser)

export default router;