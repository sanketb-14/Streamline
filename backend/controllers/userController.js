import User from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import multer from "multer";
import sharp from "sharp";


function filterObj(obj, ...allowFields) {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}


// const multerStorage = multer.diskStorage({
//     destination:(req , file , cb) => {
//         cb(null , 'public/img/users')
//     },
//     filename:(req,file,cb) =>{
//         const ext = file.mimetype.split('/')[1]
//         cb(null , `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

const multerStorage = multer.memoryStorage()

const multerFilter =(req,file ,cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null , true)
    }
    else{
        cb(new AppError("Please upload only images" , 400) , false)
    }
}

const upload  = multer({
    storage:multerStorage ,
    fileFilter:multerFilter
})

export const uploadUserPhot = upload.single('photo')

export const resizeUserPhot = (req,res,next) => {
    if(!req.file) return next()

        req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

        sharp(req.file.buffer).resize(250,250).toFormat('jpeg').jpeg({
            quality:90
        }).toFile(`public/img/users/${req.file.filename}`)

        next()
}


export const getMe = catchAsync(async(req,res,next) => {
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new AppError("User not found" , 404))
    }
    res.status(200).json({
        status: "success",
        data: {
            user
        }

    })
})

export const updateMe = catchAsync(async(req,res,next) => {

    // only fullName,email and photo user can update
    const filter =  filterObj(req.body , 'fullName' , 'email')
    if(req.file) filter.photo = req.file.filename
    
    
    
    const user = await User.findByIdAndUpdate(req.user.id , filter , {new:true , runValidators: true})

    if(!user){
        return next(new AppError("User not found" , 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
})

export const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false })
    res.status(204).json({ status: "success", data: null })
})

export const getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })
})