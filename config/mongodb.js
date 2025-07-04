import mongoose, { mongo } from "mongoose";

const connectDB= async()=>{

    mongoose.connection.on('connected',()=>{
        console.log("DB CONNECTED");
        
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/Deal-O-City`)
}


export default connectDB;