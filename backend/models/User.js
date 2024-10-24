
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, "Please tell us your full name!"],
        minlength: 1,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        
    },
    photo: {
        type:String ,
        default: 'default.webp'

    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        maxLength:30,
        select: false,
    },
    passwordConfirm:{
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function(password){
                return password === this.password;

                  },
                  message: "Passwords are not the same!",
                }
        
    },
    role:{
        type:String ,
        enum :['user','admin'],
        default:"user"
    },

    accountStatus:{
        type:Boolean ,
        default :true , 
        select:false
    },
    
})

userSchema.pre("save", async function(next){

    const salt = 12
  
    this.password = await bcrypt.hash(this.password, salt);
  
    this.passwordConfirm = undefined;
    // Proceeds to the next middleware in the chain
    next();
})

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    const status =  await bcrypt.compare(candidatePassword, userPassword);
    console.log("status" , status);
    
    return status
};

const User = mongoose.model("User", userSchema);

export default User;

