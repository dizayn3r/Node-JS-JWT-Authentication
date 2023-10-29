import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

var checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      // Verify the token
      const { user_id } = jwt.verify(token, process.env.SECRET_KEY);

      // Get User from token
      req.user = await UserModel.findById(user_id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .send({ status: "failed", message: "Unauthorized Access" });
    }
  }

  if (!authorization) {
    res.status(400).send({ status: "failed", message: "Missing Header" });
  }

  if (!token) {
    res
      .status(401)
      .send({
        status: "failed",
        message: "Unauthorized Access, Invalid token",
      });
  }
};

export default checkUserAuth;
