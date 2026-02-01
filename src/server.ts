import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import connectDB from "./config/db";
import passport from "passport";
import "./config/passport";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Connect to database before starting server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📄 Swagger docs at http://localhost:${PORT}/api-docs`);
  });
});
