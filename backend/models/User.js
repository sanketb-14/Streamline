import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please tell us your full name!"],
    minlength: 1,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true, 
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg",
  },
  provider: {
    type: [String],
    default: ["local"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (password) {
        return password === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  accountStatus: {
    type: Boolean,
    default: true,
    select: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: false,
  },
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified
  
  const salt = 12;
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined; // Remove passwordConfirm field
  next();
});

// Pre-find hook to filter out inactive users
userSchema.pre(/^find/, function (next) {
  this.find({ accountStatus: { $ne: false } }); // Use `accountStatus` instead of `active`
  next();
});

// Method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};




const User = mongoose.model("User", userSchema);

export default User;