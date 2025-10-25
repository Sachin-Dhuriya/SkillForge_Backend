import prisma from "../../config/prismaClient.js";

const nameUpdate = async (req, res, next) => {
  try {
    let user = await prisma.User.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found..!!!" });

    let name = req.body.name;
    if (!name)
      return res.status(400).json({ message: "Name field required..!!!" });
    if (name.length < 3)
      return res
        .status(400)
        .json({ message: "Name must have atleast 3 character" });
    if (name === user.name)
      return res.status(400).json({ messgae: `Name is already ${user.name}` });

    let updatedData = await prisma.User.update({
      where: { id: req.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res
      .status(200)
      .json({ message: "Name updated successfully..!!!!", updatedData });
  } catch (error) {
    next(error);
  }
};

const nameDelete = async (req, res, next) => {
  try {
    let user = await prisma.User.findUnique({ where: { id: req.user.id } });
    if (!user)
      return res.status(404).json({ message: "User does not exist..!!!" });

    let deletedUser = await prisma.User.delete({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    res
      .status(200)
      .json({ message: "User deleted successfully..!!!", deletedUser });
  } catch (error) {
    next(error);
  }
};
export { nameUpdate, nameDelete };
