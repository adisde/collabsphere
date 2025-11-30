import express from "express";
import { confirmUserEmail, loginUserSession, logoutUserSession, registerUser, resetUserPassword, sendPasswordResetEmail, updateUsername } from "../controllers/userController.js";
import { tokenAuthorize } from "../middlewares/tokenAuthorize.js";
import { userAuthorize } from "../middlewares/userAuthorize.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUserSession);
router.post("/logout", userAuthorize, logoutUserSession);

router.post("/confirm-email", tokenAuthorize, confirmUserEmail);
router.post("/reset-email", sendPasswordResetEmail);
router.put("/reset-password", tokenAuthorize, resetUserPassword);

router.put("/update", userAuthorize, updateUsername);

export default router;
