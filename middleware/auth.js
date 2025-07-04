import jwt from 'jsonwebtoken'


const authUser = async (req,res,next) => {
 const {token} = req.headers;


 if(!token)
 {
    return res.json({success:false,message:"Login to place order"})
 }
 else{

    try {
        const token_decode=jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId=token_decode.id
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        next();
        
    }
 }
}




export default authUser;