import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Signup = () => {
    const[firstname,setfirstname] = useState("");
    const[lastname,setlastname] = useState("");
    const[email,setemail] = useState("");
    const[password,setpassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            console.log("Request going...");
    
            const response = await axios.post("http://localhost:3000/user/sign-up", {
                firstname,
                lastname,
                email,
                password
            });
    
            console.log("Response:", response.data);
    
            if (response.status === 200) { 
                alert(response.data.message); 
                navigate("/login");  
            } else {
                alert("Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "An error occurred. Please check your details and try again.");
        }
    };
    
    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="bg-gray-300 h-150 w-110 rounded-md ">
                    <div className="flex justify-center pt-5 font-bold text-4xl">
                        Sign up
                    </div>

                    <div className="flex justify-center pt-4 font-light text-xl">
                        Enter your Information to create an Account
                    </div>

                    <div className="flex flex-col m-5">
                        <label>Firstname</label>
                        <input onChange={(e)=>{setfirstname(e.target.value)}} type="text" placeholder="Enter your firstname"  className="border-2 rounded-md p-2 mt-2"/>
                    </div>

                    <div className="flex flex-col m-5">
                        <label>Lastname</label>
                        <input onChange={(e)=>{setlastname(e.target.value)}}  type="text" placeholder="Enter your Lastname"  className="border-2 rounded-md p-2 mt-2"/>
                    </div>

                    <div className="flex flex-col m-5">
                        <label>E-mail</label>
                        <input onChange={(e)=>{setemail(e.target.value)}} type="text" placeholder="Enter your E-mail"  className="border-2 rounded-md p-2 mt-2"/>
                    </div>

                    <div className="flex flex-col m-5">
                        <label>Password</label>
                        <input onChange={(e)=>{setpassword(e.target.value)}}  type="text" placeholder="Enter your password"  className="border-2 rounded-md p-2 mt-2"/>
                    </div>   

                    <div className="flex justify-center">
                        <button 
                        // onClick={()=>{
                        //     axios.post("http://localhost:5000/user/register",{
                        //         firstname,
                        //         lastname,
                        //         email,
                        //         password
                        //     })
                        // }} 
                        onClick={handleSignup}
                        className="bg-zinc-900 text-white px-6 py-2 rounded-md cursor-pointer">
                            Sign up
                        </button>
                    </div>

                    <div className="flex justify-center pt-2">
                        Already have an Account?
                        <span className="text-blue-500 underline cursor-pointer ml-1" onClick={() => navigate('/login')}>
                            Sign in
                        </span>
                    </div>
                </div>
            </div>
        </>
    );      
};

export default Signup;