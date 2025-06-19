import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.get("/", (_req, res) => {
  res.send("User");
});

export default app;
