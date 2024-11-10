import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
    path: "./.env",
});


const app = express();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


import userRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/task.route.js";

app.use("/api/v1/users", userRoutes)
app.use("/api/v2/tasks", taskRoutes)


mongoose
  .connect(mongoUrl)
  .then(() => app.listen(port))
  .then(() => console.log(`connected to port ${port}`))
  .catch((err) => console.log(err.message));
