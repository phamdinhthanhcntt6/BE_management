import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use("/auth", userRoutes);
app.use("/admin", adminRoutes);

// Cấu hình Swagger UI và lấy file swagger.json từ file swagger.ts
setupSwagger(app);

// Cấu hình Swagger UI (cũ)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

// Serve swagger.json
app.use("/swagger.json", express.static("src/swagger/swagger.json"));

app.get("/", (_req, res) => {
  res.send("User Management API");
});

export default app;
