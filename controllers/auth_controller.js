import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

class AuthController {
  // Generate token
  static refreshToken = async (req, res) => {
    try {
      const { token } = req.body;
      if (token) {
        const decodedToken = jwt.decode(token);
        const { accessToken } = decodedToken;
        const { userID } = jwt.decode(accessToken);
        const user = await UserModel.findOne({ _id: userID });
        const generatedAccessToken = jwt.sign(
          { userID: user._id },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        const generatedRefreshToken = jwt.sign(
          { accessToken: generatedAccessToken },
          process.env.SECRET_KEY,
          { expiresIn: "3d" }
        );
        res.status(200).send({
          status: "success",
          message: "Generated access token",
          accessToken: generatedAccessToken,
          refreshToken: generatedRefreshToken,
        });
      } else {
        res
          .status(200)
          .send({ status: "failed", message: "Provide access token" });
      }
    } catch (error) {
      console.error(error.message);
      res
          .status(200)
          .send({ status: "failed", message: "Invalid Token" });
    }
  };
}

export default AuthController;
