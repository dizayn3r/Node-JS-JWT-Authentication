import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

// Defining the user schema
const UserSchema = new Schema({
  _id: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  created_at: { type: Date, required: true, trim: true },
  updated_at: { type: Date, required: true, trim: true },
});

// UserSchema.pre('save', function(next) {
//   var user = this;

//   // only hash the password if it has been modified (or is new)
//   if (!user.isModified('password')) return next();

//   // generate a salt
//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//       if (err) return next(err);

//       // hash the password using our new salt
//       bcrypt.hash(user.password, salt, function(err, hash) {
//           if (err) return next(err);
//           // override the cleartext password with the hashed one
//           user.password = hash;
//           next();
//       });
//   });
// });

// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//       if (err) return cb(err);
//       cb(null, isMatch);
//   });
// };

// User Model
const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
