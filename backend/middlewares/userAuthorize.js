import jwt from "jsonwebtoken";

export const userAuthorize = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        messsage: "Missing headers for this request.",
      });
    }

    const filterToken = header.split(" ")[1];

    const confirmToken = jwt.verify(filterToken, process.env.JWT_SECRET);

    if (!confirmToken) {
      return res.status(401).json({
        messsage: "Invalid or expired token",
      });
    }

    req.user = { user_id: confirmToken.id };

    next();
  } catch (err) {
    return res.status(500).json({
      messsage: "Something went wrong",
    });
  }
};
