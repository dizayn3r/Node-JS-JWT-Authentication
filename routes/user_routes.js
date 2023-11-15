import express from "express";
import UserController from "../controllers/user_controller.js";
import checkUserAuth from "../middlewares/auth_middleware.js";
const router = express.Router();

// Route level middleware
router.use("/change-password", checkUserAuth);
router.use("/profile", checkUserAuth);

// Public routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/reset-password", UserController.resetPassword);
router.post("/set-password/:id/:token", UserController.setPassword);

// Protected routes
router.post("/change-password", UserController.changePassword);
router.get("/profile", UserController.profile);

export default router;
