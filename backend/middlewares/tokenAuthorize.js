import { verifyToken } from "../services/tokenService.js";

export const tokenAuthorize = async (req, res, next) => {
    try {
        const { token } = req.query;

        if (!token) return res.status(401).json({ ok: false, message: "Invalid token." });

        const confirmToken = await verifyToken(token);
        if (!confirmToken.ok) return res.status(401).json({ ok: false, message: confirmToken.message });

        req.user_id = confirmToken.user_id;
        req.from = confirmToken.from;
        next();
    } catch (err) {
        console.error("Token authentication error : " + err.message);
        return res.status(500).json({ ok: false, message: "Something went wrong." });
    }
}