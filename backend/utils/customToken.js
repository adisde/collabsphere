import crypto from "crypto";

const customToken = new Map();

export const generateEmailToken = async (email) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expire = Date.now() + 1000 * 60 * 15;
    customToken.set(token, { email, expire });
    return token;
}

export const authenticateToken = async (token) => {
    const record = customToken.get(token);
    if (!record) return { message: "Token not found.", isSuccess: false };

    if (record.expire < Date.now()) {
        customToken.delete(token);
        return {
            message: "Token is expired.",
            isSuccess: false,
        }
    }

    customToken.delete(token);

    return {
        message: "Email verified successfully.",
        email: record.email,
        isSuccess: true,
    }
}