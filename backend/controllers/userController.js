import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken, generateEmailToken } from "../utils/customToken.js";
import Log from "../models/logModel.js";

// Creating new user

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Invalid or missing required information.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password length must be greater than 8 characters.",
    });
  }

  const isExistEmail = await User.searchEmail({ email: email.trim() });
  const isExistUsername = await User.searchUsername({
    username: username.trim(),
  });

  if (isExistEmail) {
    return res.status(400).json({
      message: "Account already exists with this email.",
    });
  }

  if (isExistUsername) {
    return res.status(400).json({
      message: "Username has been used, try another one.",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password.trim(), 10);
    const createUserAccount = await User.createUser({
      email: email.trim(),
      username: username.trim(),
      password: hashPassword,
    });

    const token = await generateEmailToken(email.trim());
    console.log(token);

    if (!createUserAccount) {
      return res.status(400).json({
        message: "Failed to create account, try again.",
      });
    }

    await Log.createUserLog({
      user_id: createUserAccount.id,
      log_message: "Account has been created.",
    });

    return res.status(200).json({
      message: "Verification email has been sent to ur email.",
    });
  } catch (err) {
    console.error("Account creation Error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Verifying the email token and updating user verification status

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: "Invalid or missing token.",
    });
  }

  const isTokenValid = await authenticateToken(token);

  if (!isTokenValid.isSuccess) {
    return res.status(400).json({
      message: isTokenValid.message,
    });
  }

  try {
    const updateUser = await User.updateVerification({
      email: isTokenValid.email,
      isverified: true,
    });

    if (!updateUser) {
      return res.status(400).json({
        message: "Email verification failed.",
      });
    }

    await Log.createUserLog({
      user_id: updateUser.id,
      log_message: "Account has been verified.",
    });
    return res.status(200).json({
      message: "Email has been verified, now u can login.",
    });
  } catch (err) {
    console.error("Email verfication error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// User login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid or missing email and password.",
      });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({
        message: "Password length must be greater than 8 characters.",
      });
    }

    const searchEmail = await User.searchEmail({ email: email.trim() });

    if (!searchEmail) {
      return res.status(400).json({
        message: "Invalid email.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password.trim(),
      searchEmail.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email and password.",
      });
    }

    if (searchEmail.isverified == false) {
      await generateEmailToken(email.trim());
      return res.status(400).json({
        message: "Verification email has been sent.",
      });
    }

    const userPayload = {
      id: searchEmail.id,
      email: searchEmail.email,
    };

    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.cookie("ctoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "prod",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 * 4,
    });
    console.log(searchEmail.id);
    
    await Log.createUserLog({
      user_id: searchEmail.id,
      log_message: "Login successful.",
    });
    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: searchEmail.id,
        email: searchEmail.email,
        username: searchEmail.username,
      },
    });
  } catch (err) {
    await Log.createUserLog({
      user_id: searchEmail.id,
      log_message: "Login Failed.",
    });
    console.error("Login error : ", err.message);
    return res.status(500).json({
      message: "Somthing went wrong.",
      sysMessage: err.message,
    });
  }
};

// Forgot Password

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Invalid email.",
      });
    }

    const isExistEmail = await User.searchEmail({ email: email.trim() });

    if (isExistEmail) {
      const token = await generateEmailToken(email.trim());
      console.log(token);

      return res.status(200).json({
        message:
          "If email is registered with us, u will receive an verification email.",
      });
    }

    return res.status(200).json({
      message:
        "If email is registered with us, u will receive an verification email.",
    });
  } catch (err) {
    console.error("Forgot password error : ", err.message);
    return res.status(500).json({
      message: "Somthing went wrong.",
      sysMessage: err.message,
    });
  }
};

// Change Password

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: "Invalid or missing token.",
      });
    }

    const isTokenValid = await authenticateToken(token);

    if (!isTokenValid.isSuccess) {
      return res.status(400).json({
        message: isTokenValid.message,
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Missing password.",
      });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({
        message: "Password length must be greater than 8 characters.",
      });
    }

    const hashPassword = await bcrypt.hash(password.trim(), 10);

    const updatePassword = await User.updatePassword({
      email: isTokenValid.email,
      password: hashPassword,
    });

    if (!updatePassword) {
      return res.status(400).json({
        message: "Failed to update password.",
      });
    }

    await Log.createUserLog({
      user_id: updatePassword.id,
      log_message: "Password has been changed.",
    });

    return res.status(200).json({
      message: "Password has been updated, u can login now.",
    });
  } catch (err) {
    console.error("Change password error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// Update user details

export const updateUserDetails = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        message: "Invalid or missing username and email.",
      });
    }

    const isExistEmail = await User.searchEmail({ email: email.trim() });

    if (!isExistEmail) {
      return res.status(400).json({
        message: "Email does not exist.",
      });
    }

    const isExistUsername = await User.searchUsername({
      username: username.trim(),
    });

    if (isExistUsername && isExistUsername.email !== email.trim()) {
      return res.status(400).json({
        message: "Username has been used, try another one.",
      });
    }

    const updateDetails = await User.updateUser({
      email: email.trim(),
      username: username.trim(),
    });

    if (!updateDetails) {
      return res.status(400).json({
        message: "Failed to update ur details.",
      });
    }

    await Log.createUserLog({
      user_id: updateDetails.id,
      log_message: "User details has been updated.",
    });
    return res.status(200).json({
      message: "Your details has been updated, refresh the page.",
    });
  } catch (err) {
    console.error("Update details error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};

// User logout

export const logoutUser = async (req, res) => {
  try {
    const { id } = req.query;
    res.clearCookie("ctoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "strict",
    });

    await Log.createUserLog({ user_id: id, log_message: "Logout successful." });
    return res.status(200).json({
      message: "Logged out successful.",
    });
  } catch (err) {
    console.error("Update details error : ", err.message);
    return res.status(500).json({
      message: "Something went wrong.",
      sysMessage: err.message,
    });
  }
};
