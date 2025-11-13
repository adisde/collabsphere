import express from "express";
import { changePassword, createUser, forgotPassword, loginUser, logoutUser, updateUserDetails, verifyEmail } from "../controllers/userController.js";

const router = express.Router();

// User Routes

router.post("/", createUser);
router.get("/confirm", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.post("/logout", logoutUser);
router.put("/change-password", changePassword);
router.put("/update", updateUserDetails);

export default router;
