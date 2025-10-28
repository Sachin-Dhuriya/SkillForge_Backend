import express from 'express';
const router = express.Router();
import { addCourse, allCourse, selectedCourse, deleteCourse } from '../controllers/courseController.js';
import authenticate from '../../middlewares/authMiddleware.js';

router.post('/add',authenticate,addCourse);
router.get('/viewall', allCourse)
router.get('/:id/details', selectedCourse)
router.delete('/:id/delete',authenticate, deleteCourse)

export default router;