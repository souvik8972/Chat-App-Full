const User=require("../models/userDb")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const secretKey=process.env.SECRET_KEY


exports.signup=async(req,res)=>{
    const {username,email,phonenumber,password,confpassword} = req.body;

    
    try {

    

        //checking user present or not by using email
    const user=await User.findAll({
    where:{
        email: email,
        phonenumber: phonenumber

    }
})
//if user is not present
    if(user==""){
        if(confpassword!==password){
            return res.status(403).send("password does not matched")
        }
        //creating a has pasword using bcrypt.hash function and adding solt value of 10
        const hasHpasswords=await bcrypt.hash(password,10);
        //createing a new user
        await User.create({
            username:username,
            email:email,
            phonenumber: phonenumber,
            password: hasHpasswords,  
        })
//sending status message of successful
    res.status(201).send("successfully created")

    }else{
        //user already present
        res.status(401).send("user already present")
}

    } catch (error) {
        res.status(501).send("internal error")
        
    }  

}





exports.login=async(req,res)=>{
    try {
        const {email,password} = req.body
        //checking is user present or not
        const user=await User.findAll({
            where:{
                email:email
            }
        })
        //if user not  present
        if (user.length==0){
            res.status(404).send("Email not found")
        }else{
           
            //if user present
            //compare password by using bcrypt.compare  user inter password and save password in database
            const passwordEncoded =await bcrypt.compare(password,user[0].password)
            //if matches password
            if (passwordEncoded){
                //creating a token by using jwt.sign() and passing user is ,name ,isprime and that will expire in 5 days
                const token = jwt.sign({ userId: user[0].id,name:user[0].username}, secretKey, { expiresIn: "5d" });
    //sending user as response
            res.status(200).json({token:token,user:user[0]})
            }else{
                //password not matched
                res.status(401).send("Invalid user")
            }
        
        
        }
    
    } catch (error) {
        console.log(error);
            res.status(500).send('An error occurred during authentication')
        
    }
    
    
    }


////validation details

    function validateUserData(username, email, phonenumber, password) {
        // Validate username
        if (!username || username.trim() === '') {
          return 'Username is required';
        }
      
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          return 'Invalid email format';
        }
      
        // Validate phone number
        
      
        // Validate password (customize the criteria as needed)
        if (!password || password.length < 4) {
          return 'Password is required and should be at least 6 characters';
        }
      
        // If all validations pass, return null
        return null;
      }