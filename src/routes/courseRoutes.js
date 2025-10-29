import express from "express";
const router = express.Router();
import {
  addCourse,
  allCourse,
  selectedCourse,
  deleteCourse,
  editCourse,
} from "../controllers/courseController.js";
import authenticate from "../../middlewares/authMiddleware.js";

router.post("/add", authenticate, addCourse);
router.get("/all", allCourse);
router.get("/:id", selectedCourse);
router.put("/:id/edit", authenticate, editCourse);
router.delete("/:id/delete", authenticate, deleteCourse);

export default router;
