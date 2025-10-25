import express from "express";
const router = express.Router();
import authenticate from "../../middlewares/authMiddleware.js";
import { nameUpdate, nameDelete } from "../controllers/profileController.js";

router.put('/update',authenticate,nameUpdate)
router.delete('/delete',authenticate,nameDelete)

export default router;
