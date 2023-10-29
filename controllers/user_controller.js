import UserModel from "../models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  // User Registration
  static register = async (req, res) => {
    const { name, username, email, password, confirm_password, role } =
      req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      if (name && username && email && password && confirm_password && role) {
        if (password === confirm_password) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            let _id = new mongoose.Types.ObjectId().toHexString();
            let date = new Date();
            const user = new UserModel({
              _id: _id,
              name: name,
              username: username,
              email: email,
              password: hashedPassword,
              role: role,
              created_at: date,
              updated_at: date,
            });
            await user.save();
            res.status(201).send({
              status: "success",
              message: "User registred successfully",
            });
          } catch (error) {
            console.error(error);
            res.send({
              status: "failed",
              message: `${error.message}`,
            });
          }
        } else {
          res.status(200).send({
            status: "failed",
            message: "Passwords do not match",
          });
        }
      } else {
        res
          .status(200)
          .send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  // User login
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });
        if (user != null) {
          const isEmailMatch = user.email === email;
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (isEmailMatch && isPasswordMatch) {
            const accessToken = jwt.sign(
              { user_id: user._id, role: user.role },
              process.env.SECRET_KEY,
              { expiresIn: "1d" }
            );
            const refreshToken = jwt.sign(
              { accessToken: accessToken },
              process.env.SECRET_KEY,
              { expiresIn: "3d" }
            );
            res.status(200).send({
              status: "success",
              message: "User available.",
              accessToken: accessToken,
              refreshToken: refreshToken,
            });
          } else {
            res
              .status(401)
              .send({ status: "failed", message: "Wrong Credentials." });
          }
        } else {
          res
            .status(200)
            .send({ status: "failed", message: "Not a registered user." });
        }
      } else {
        res
          .status(200)
          .send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Change password
  static changePassword = async (req, res) => {
    try {
      const { old_password, new_password, new_confirm_password } = req.body;
      // All fields are required
      if (old_password && new_password && new_confirm_password) {
        const user = await UserModel.findOne({ email: req.user.email });
        const isPasswordMatch = await bcrypt.compare(
          old_password,
          user.password
        );
        if (isPasswordMatch) {
          // Check if new password and new confirm password are the same
          if (new_password === new_confirm_password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(new_password, salt);
            const updated_at = new Date();
            // Filter out users with id
            const filter = { _id: user._id };
            // Update password and update at attributes
            const update = { password: hashedPassword, updated_at: updated_at };
            const updatedUser = await UserModel.updateOne(filter, update);
            const { acknowledged, modifiedCount, matchedCount } = updatedUser;
            if (acknowledged && modifiedCount === matchedCount) {
              res
                .status(200)
                .send({ status: "success", message: "Password changed." });
            } else {
              res.status(200).send({
                status: "failed",
                message: "Unable to update password",
              });
            }
          } else {
            res
              .status(200)
              .send({ status: "failed", message: "Passwords do not match." });
          }
        } else {
          res
            .status(200)
            .send({ status: "failed", message: "Wrong password." });
        }
      } else {
        res
          .status(400)
          .send({ status: "failed", message: "All fields are required." });
      }
    } catch (error) {
      res.status(401).send({ status: "failed", message: `${error.message}` });
    }
  };

  // User Profile
  static profile = async (req, res) => {
    try {
      const user = req.user;
      // All fields are required
      if (user != null) {
        const user = await UserModel.findOne({ email: req.user.email })
          .select("-password")
          .select("-__v");
        res.status(200).send({
          status: "success",
          message: "User found",
          user: user.toJSON(),
        });
      } else {
        res.status(200).send({ status: "failed", message: "No user present" });
      }
    } catch (error) {
      res.status(401).send({ status: "failed", message: `${error.message}` });
    }
  };

  // Update Profile

  // Reset Password
  static resetPassword = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.SECRET_KEY;
        const token = jwt.sign({ user_id: user._id }, secret, {
          expiresIn: "5m",
        });
        const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`;
        console.log(link);
        res.send({ status: "success", message: "E-mail is send." });
      } else {
        res.send({ status: "failed", message: "Email does not exist." });
      }
    } else {
      res.status(400).send({ status: "failed", message: "Email is required." });
    }
  };

  // Set Password
  static setPassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;
    if (id && token && password && confirm_password) {
      // Getting user using params id
      const user = await UserModel.findOne({ _id: id });
      const new_secret = user._id + process.env.SECRET_KEY;
      try {
        jwt.verify(token, new_secret);
        // Check if new password and new confirm password are the same
        if (password === confirm_password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const updated_at = new Date();
          // Filter out users with id
          const filter = { _id: user._id };
          // Update password and update at attributes
          const update = { password: hashedPassword, updated_at: updated_at };
          const updatedUser = await UserModel.updateOne(filter, update);
          const { acknowledged, modifiedCount, matchedCount } = updatedUser;
          if (acknowledged && modifiedCount === matchedCount) {
            res
              .status(200)
              .send({ status: "success", message: "Password changed." });
          } else {
            res.status(200).send({
              status: "failed",
              message: "Unable to update password",
            });
          }
        } else {
          res
            .status(200)
            .send({ status: "failed", message: "Passwords do not match." });
        }
      } catch (error) {}
    } else {
      res
        .status(400)
        .send({ status: "failed", message: "All fields are required." });
    }
  };

  // Delete Account
}

export default UserController;
