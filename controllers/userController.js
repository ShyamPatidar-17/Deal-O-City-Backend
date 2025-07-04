import userModel from "../models/userModel.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, messgae: error.message })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await userModel.findOne({ email })

        if (exist) {
            return res.json({ success: false, message: "User Already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "PLease enter a strong password" })
        }

        //Hashing Password

        const salt = await bcrypt.genSalt(7)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, email, password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)

        res.json({ sucess: true, token })
    } catch (error) {
        console.log(error)
        res.json({ success: false, messgae: error.message })
    }
}

const adminLogin = async (req, res) => {
try {
    const {email,password}=req.body
    if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD)
    {
        const token=jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,token})
    }
    else{
        res.json({success:false,message:"Invalid Credentials"})
    }
} catch (error) {
     console.log(error)
        res.json({ success: false, messgae: error.message })
}
}




const profile=async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to get profile' });
  }
};





export { loginUser, registerUser, adminLogin,profile }