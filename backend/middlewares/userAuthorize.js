import jwt from "jsonwebtoken";

export const userAuthorize = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ ok: false, messsage: "Missing request headers." });

    const filterToken = header.split(" ")[1];

    const confirmToken = jwt.verify(filterToken, process.env.JWT_SECRET);

    if (!confirmToken) return res.status(401).json({ ok: false, messsage: "Invalid token" });

    req.user_id = confirmToken.id;

    next();
  } catch (err) {
    return res.status(500).json({ ok: false, messsage: "Something went wrong." });
  }
};
