import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use("/api/auth", userRouter);
app.use("/api/admin", adminRouter);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
