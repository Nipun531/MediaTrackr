const express=require("express")
const app=express()
const cors=require("cors")
const UserRoutes=require("./routes/UserRoutes")
const MediaRoutes = require('./routes/MediaRoutes')

const dotenv=require("dotenv")
dotenv.config();
const connectdb=require("./db")

const port=3000;
app.use(cors());
app.use(express.json())
app.use('/user',UserRoutes)
app.use('/media',MediaRoutes)

connectdb()
.then(()=>{
    console.log("mongodb connected successfully");
    app.listen(port,()=>{
        console.log('listening on port',port);
    });
})
.catch((error)=>{
    console.log("mongodb connection error",error);
})
