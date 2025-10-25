//---------------Express Setup-----------------------
import express from "express";
const app = express();
//---------------DOTENV------------------------
import "dotenv/config";
//---------------CORS-----------------
import cors from "cors";
//---------------Morgan(Logger)-----------------
import morgan from "morgan";
//---------------Middlewares-------------------
import errorHandler from "./middlewares/errorHandler.js";
app.use(morgan());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-----------------Routes---------------------
//--AuthRoutes--
import authRoutes from "./src/routes/authRoutes.js";
app.use("/api/auth", authRoutes);
//--ProfileRoutes---
import profileRoutes from "./src/routes/profileRoutes.js";
app.use("/api/profile", profileRoutes);

app.get("/trial", (req, res, next) => {
  try {
    res.status(200).json({ message: "Project is working...!!!" });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...!!!`);
});
