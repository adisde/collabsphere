import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Log from "../models/logModel.js";
import { inputValidator } from "../helpers/inputsValidator.js";
import { passwordValidator } from "../helpers/passwordValidator.js";
import { sendEmail } from "../services/emailService.js";
import { generateToken } from "../services/tokenService.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = inputValidator(["username", "email", "password"], req.body);
    if (!result.ok) return res.status(400).json({ message: result.message });

    const resultPassword = passwordValidator(password);
    if (!resultPassword.ok) return res.status(400).json({ message: resultPassword.message });

    const isExistEmail = await User.searchEmail({ email: email.trim() });
    if (isExistEmail) return res.status(400).json({ ok: false, message: "Email already exists" });

    const isExistUsername = await User.searchUsername({ username: username.trim() });
    if (isExistUsername) return res.status(400).json({ ok: false, message: "Username already taken." });

    const hashPassword = await bcrypt.hash(password.trim(), 10);

    const createUserAccount = await User.createUser({ username: username.trim(), email: email.trim(), password: hashPassword });

    if (!createUserAccount) return res.status(400).json({ ok: false, message: "Failed to create user account." });

    const token = await generateToken(createUserAccount.id, "email");

    await sendEmail(email, "email", token);

    await Log.createUserLog({ user_id: createUserAccount.id, log_message: "Account created." });

    return res.status(200).json({
      ok: true,
      message: "Verification email sent."
    });

  } catch (err) {
    console.error("Create user error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });

  }
};

export const confirmUserEmail = async (req, res) => {
  try {
    const { user_id, from } = req;

    if (from !== "email") return res.status(400).json({ ok: false, message: "Invalid user." })

    const isExistUser = await User.findById({ user_id });
    if (!isExistUser) return res.status(400).json({ ok: false, message: "Invalid user." });

    if (isExistUser.isverified) return res.status(200).json({ ok: true, message: "Email already verified." });

    const updateStatus = await User.updateVerification({ user_id });
    if (!updateStatus) return res.status(400).json({ ok: false, message: "Failed to verify email." });

    await Log.createUserLog({ user_id, log_message: "Account verified." });

    return res.status(200).json({ ok: true, message: "Verified successfully, You can login." });
  } catch (err) {
    console.error("Email verification error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const loginUserSession = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = inputValidator(["email", "password"], req.body);

    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistEmail = await User.searchEmail({ email: email.trim() });
    if (!isExistEmail) return res.status(401).json({ ok: false, message: "Email not exist" });

    if (!isExistEmail.isverified) {
      const token = await generateToken(isExistEmail.id, "email");
      await sendEmail(email, "email", token);

      return res.status(200).json({ ok: true, message: "Verification email sent." });
    }

    const userLogin = await User.getUserForLogin({ email: email.trim() });

    if (!userLogin) return res.status(401).json({ ok: false, message: "Something went wrong." });

    const isPasswordMatch = await bcrypt.compare(password.trim(), userLogin.password);

    if (!isPasswordMatch) return res.status(401).json({ ok: false, message: "Invalid email or password." });

    const token = jwt.sign(
      { id: userLogin.id, email: userLogin.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.cookie("collabtoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000
    });

    await Log.createUserLog({ user_id: userLogin.id, log_message: "Login successful." });

    return res.status(200).json({ ok: true, message: "Login successful", user: { id: userLogin.id, email: userLogin.email } });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong" });
  }
};

export const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const result = inputValidator(["email"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistEmail = await User.searchEmail({ email: email.trim() });

    if (isExistEmail) {
      const passwordToken = await generateToken(isExistEmail.id, "password");
      await sendEmail(email.trim(), "password", passwordToken);

      return res.status(200).json({ ok: true, message: "If email is registered with us, u will receive an verification email." });
    }

    return res.status(200).json({ ok: true, message: "If email is registered with us, u will receive an verification email." });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { user_id, from } = req;

    const resultPassword = passwordValidator(password.trim());
    if (!resultPassword.ok) return res.status(400).json({ ok: false, message: resultPassword.message });

    if (!user_id || !from) return res.status(401).json({ ok: false, message: "Invalid user" });

    if (from !== "password") return res.status(401).json({ ok: false, message: "Invalid user." });

    const searchUser = await User.findById({ user_id });
    if (!searchUser) return res.status(404).json({ ok: false, message: "User not found." });

    const hashPassword = await bcrypt.hash(password, 10);
    const updateUserPassword = await User.updatePassword({ user_id, password: hashPassword });

    if (!updateUserPassword) return res.status(400).json({ ok: false, message: "Failed to change password." });

    await Log.createUserLog({ user_id, log_message: "Password changed." });

    return res.status(200).json({ ok: true, message: "Password changed, You can login." })
  } catch (err) {
    console.error("Change password error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { email, username } = req.body;

    const result = inputValidator(["email", "username"], req.body);
    if (!result.ok) return res.status(400).json({ ok: false, message: result.message });

    const isExistEmail = await User.searchEmail({ email: email.trim() });
    if (!isExistEmail) return res.status(404).json({ ok: false, message: "Email does not exist." });

    const isExistUsername = await User.searchUsername({ username: username.trim() });
    
    if (isExistEmail.username == username.trim()) return res.status(200).json({ ok: true, message: "Your account have this username." });
    if (isExistUsername) return res.status(400).json({ ok: false, message: "Username is taken." });

    const updateDetails = await User.updateUser({ username, user_id: isExistEmail.id });
    if (!updateDetails) return res.status(400).json({ ok: false, message: "Failed to update username." });

    await Log.createUserLog({ user_id: isExistEmail.id, log_message: "Updated username." });

    return res.status(200).json({ ok: true, message: "Username updated." })

  } catch (err) {
    console.error("Update username error : ", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong" });
  }
};

export const logoutUserSession = async (req, res) => {
  try {
    const user_id = req.user_id;

    if (!user_id) return res.status(400).json({ ok: false, message: "Invalid user." });

    res.clearCookie("collabtoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
    });

    await Log.createUserLog({ user_id, log_message: "Logout successful." });

    return res.status(200).json({ ok: true, message: "Logout successful." });
  } catch (err) {
    console.error("Logout error:", err.message);
    return res.status(500).json({ ok: false, message: "Something went wrong." });
  }
};
