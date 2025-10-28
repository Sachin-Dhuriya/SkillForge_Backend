import express from 'express';
const router = express.Router();
import { addCourse } from '../controllers/courseController.js';
import authenticate from '../../middlewares/authMiddleware.js';

router.post('/add',authenticate,addCourse);

export default router;