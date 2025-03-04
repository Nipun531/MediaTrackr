const express=require("express")
const User=require("../models/userSchema")
const jwt=require("jsonwebtoken")
// const app=express();
// const port=3000;
const router  = express.Router();

const secret = 'asdafsfwf4kuiiuh4353lknlui9';


router.post("/sign-up",async(req,res) =>{
    try{
    console.log("req recivd in uer signup");
    
    const inputData=req.body;
    console.log(inputData);
    const {firstname,lastname,email,password}=inputData;
    if(!firstname || !lastname || !email || !password){
        return res.status(400).json({
            msg: "enter full details"
        })               
    }
    const user= await User.findOne({
        email
    })
    if(user){
        return res.status(400).json({
            msg: "user already exists"
        })  
    }
    await User.create({
        firstname,lastname,email,password
    })

    return res.status(200).json({
        msg: "User signed in"
    })
    }
    catch(e){
        
        return res.status(500).json({
            msg: "somthing went wrong with signup",e
            
        })
    }

    
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "Wrong email" });
        }

        if (user.password !== password) {
            return res.status(400).json({ msg: "Wrong password" });
        }

        const token = jwt.sign({ id: user._id }, secret);
        if (!token) {
            return res.status(420).json({ msg: "No token" });
        }

        return res.status(200).json({ token }); 
    } catch (e) {
        return res.status(500).json({ msg: "Something went wrong", error: e });
    }
});

router.get("/",async(req,res) =>{
    try{
        const users = await User.find({}, "firstname lastname email password gender age Location bio");
        res.send(users)
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    
})

router.put("/edit", async (req, res) => {
    try {
        const { email, firstname, lastname, password, gender, age, Location, bio } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        // Update only if the new value is provided and different
        if (firstname && firstname !== user.firstname) user.firstname = firstname;
        if (lastname && lastname !== user.lastname) user.lastname = lastname;
        if (password && password !== user.password) user.password = password;
        if (gender && gender !== user.gender) user.gender = gender;
        if (age && age !== user.age) user.age = age;
        if (Location && Location !== user.Location) user.Location = Location;
        if (bio && bio !== user.bio) user.bio = bio;

        await user.save(); // Save changes to the database

        res.status(200).json({ msg: "User details updated successfully" });
    } catch (e) {
        console.error("Error updating user:", e);
        return res.status(500).json({ msg: "Something went wrong", error: e.message });
    }
});



module.exports =router;
