const mongoose=require("mongoose");

const connectdb= async()=>{
    try{
        const db=await mongoose.connect(process.env.MONGODB_URL);
    }
    catch(error){
        console.log("error connecting mongoDB",error);
    }
}

module.exports=connectdb;