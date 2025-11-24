import crypto from "crypto";

const userTokens = new Map();
const ttl = 1000 * 60 * 10;


export const generateToken = async (user_id, from) => {
    const token = crypto.randomBytes(32).toString("hex");

    const expire = Date.now() + ttl;
    userTokens.set(token, { user_id, expire, from });

    return token;
}

export const verifyToken = async (token) => {
    const record = userTokens.get(token);

    if (!record) return { ok: false, message: "Invalid or expired token." };

    if (record.expire < Date.now()) {
        userTokens.delete(token);
        return {
            ok: false,
            message: "Token has expired.",
        }
    }

    userTokens.delete(token);

    return {
        ok: true,
        user_id: record.user_id,
        from: record.from,
        message: "Token verified successful."
    }
}

setInterval(() => {
    const now = Date.now();
    for (const [token, data] of userTokens.entries()) {
        if (data.expire < now) {
            userTokens.delete(token);
        }
    }
}, 1000 * 60 * 5);