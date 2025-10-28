import prisma from "../../config/prismaClient.js";
import courseValidator from "../../validators/courseValidator.js";

const addCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor")
      return res
        .status(400)
        .json({ message: "Only Instructor can add the Courses..!!!" });

    let userId = req.user.id;
    let user = await prisma.User.findUnique({ where: { id: userId } });
    if (!user)
      return res
        .status(404)
        .json({ message: "Instructor data not found..!!!" });

    let { error } = courseValidator.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let { title, description, price, category } = req.body;

    let addCourse = await prisma.Course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        instructorId: userId,
      },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ message: "Course created successfully..!!!", addCourse });
  } catch (error) {
    next(error);
  }
};

const allCourse = async (req, res, next) => {
  try {
    const allCourses = await prisma.Course.findMany({
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (allCourses.length === 0)
      return res.status(400).json({ message: "No course added yet..!!!" });

    res.status(200).json({ message: "All Courses", allCourses });
  } catch (error) {
    next(error);
  }
};

const selectedCourse = async (req, res, next) => {
  try {
    let id = Number(req.params.id);

    let selectedCourse = await prisma.Course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!selectedCourse)
      return res.status(404).json({ message: "Course not found..!!!" });

    res.status(200).json({ message: "Course Details", selectedCourse });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor")
      return res.status(404).json({ message: "Unauthorize Access..!!!" });

    const id = Number(req.params.id);

    const course = await prisma.Course.findUnique({
      where: { id },
    });
    if (!course)
      return res
        .status(404)
        .json({ message: "The course you want to delete does not exist..!!" });

    if (course.instructorId !== Number(req.user.id))
      return res.status(400).json({
        message: "Deletion failed you are not the instructor of this course",
      });

    let deletedCourse = await prisma.Course.delete({
      where: { id },
    });

    res.status(200).json({ message: "Course Deleted..!!", deletedCourse });
  } catch (error) {
    next(error);
  }
};

export { addCourse, allCourse, selectedCourse, deleteCourse };
