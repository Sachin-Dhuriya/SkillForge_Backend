import userValidator from "../../validators/userValidator.js";
import prisma from "../../config/prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../../config/redisClient.js";

const registerUser = async (req, res, next) => {
  try {
    const { error } = userValidator.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let { name, email, password } = req.body;

    let existingUser = await prisma.User.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exist..!!!" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.User.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    res.status(200).json({
      message: "User registered successfully..!!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password required..!!!" });

    let userExist = await prisma.User.findUnique({ where: { email } });
    if (!userExist)
      return res
        .status(404)
        .json({ message: "User not found, please signup first..!!" });

    let matchPassword = await bcrypt.compare(password, userExist.password);
    if (!matchPassword)
      return res.status(401).json({ message: "Incorrect password..!!!" });

    const token = jwt.sign(
      {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        createdAt: userExist.createdAt,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: `Welcome ${userExist.name}`, token });
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    const user = await prisma.User.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found..!!!" });

    res.status(200).json({ profile: user });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    await redisClient.set(token, "blacklisted", { EX: 3600 });

    return res.status(200).json({ message: "Logout Successfully..!!!" });
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, userProfile, logoutUser };
