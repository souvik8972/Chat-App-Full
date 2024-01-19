const User=require("../models/userDb")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const secretKey=process.env.SECRET_KEY
const { Op } = require("sequelize");
const Group = require("../models/groupDb");

exports.signup = async (req, res) => {
    const { username, email, phonenumber, password, confpassword } = req.body;

    try {
        // Validate user data
        const validationError = validateUserData(username, email, phonenumber, password);

        if (validationError) {
            // Return validation error response
            return res.status(400).json({ status: "error", error: validationError });
        }

        // Checking if the user is present by using email and phonenumber
        const user = await User.findAll({
            where: {
                [Op.or]: [
                    { email: email },
                    { phonenumber: phonenumber }
                ]
            }
        });

        // If user is not present
        if (user.length > 0) {
            res.status(401).json({ status: "error", error: "User already present" });
        } else {
            // User already present
            if (confpassword !== password) {
                return res.status(403).json({
                    status: "error",
                    error: "Password doesn't match",
                });
            }

            // Creating a hashed password using bcrypt.hash function and adding salt value of 10
            const hashedPassword = await bcrypt.hash(password, 10);

            // Creating a new user
            await User.create({
                username: username,
                email: email,
                phonenumber: phonenumber,
                password: hashedPassword,
            });

            // Sending status message of successful
            res.status(201).json({ status: "success", message: "Successfully created" });
        }
    } catch (error) {
        // Handle specific SequelizeUniqueConstraintError
        if (error.name === "SequelizeUniqueConstraintError" && error.errors[0].path === "phonenumber") {
            return res.status(400).json({
                status: "error",
                error: {
                    name: "ValidationError",
                    message: "Phone number must be unique",
                    field: "phonenumber",
                    value: phonenumber,
                },
            });
        }

        // Internal server error
        res.status(500).json({ status: "error", error: error });
    }
};







exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // checking if the user is present or not
        const user = await User.findAll({
            where: {
                email: email
            }
        });

        // if user not present
        if (user.length == 0) {
            res.status(404).json({ status: "error", error: "Email not found" });
        } else {
            // if user present
            // compare password using bcrypt.compare user-entered password and saved password in the database
            const passwordEncoded = await bcrypt.compare(password, user[0].password);

            // if passwords match
            if (passwordEncoded) {
                // creating a token using jwt.sign() and passing user id, name, isprime, and expiring in 5 days
                const token = jwt.sign({ userId: user[0].id, name: user[0].username }, secretKey, { expiresIn: "5d" });

                // check if the user is associated with group id=0
                const group = await Group.findOne({
                    where: {
                        id: 1
                    }
                });

                if (!group) {
                    // if group with id=1 does not exist, create it
                    const createdGroup = await user[0].createGroup({
                    
                        name: "Default Group",
                        membersNo: 1,
                        AdminId: user[0].id
                    });

                    
                    
                }
                // check if the user is already associated with the group with id=0
            const isUserInGroup = await group.hasUser(user);

            if (!isUserInGroup) {
                // if the user is not associated with the group, add them to the group
                await group.addUser(user);
            }
                // sending user as response
                res.status(200).json({ status: "success", message: "Successfully Login", token: token, user: user[0] });
            } else {
                // password not matched
                res.status(401).json({ status: "error", error: "Invalid Email or Password" });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "Internal error" });
    }
};


////validation details

    function validateUserData(username, email, phonenumber, password) {
        // Validate username
        if (!username || username.trim() === '') {
          return 'Username is required';
        }
      
        
        
    
        
      
        // Validate password (customize the criteria as needed)
        if (!password || password.length < 4) {
          return 'Password is required and should be at least 6 characters';
        }
      
        // If all validations pass, return null
        return null;
      }








      //
      
exports.getAllUsers = async (req, res) => {
    const user = req.user;
    
    try {
      const allUsers = await User.findAll({
        where:{
            id:{[Op.ne]:user.id}
        },
        attributes: ["id", "username"]
      });
  
      res.status(200).json({ allUsers });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };