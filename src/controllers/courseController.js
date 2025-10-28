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

export { addCourse };
