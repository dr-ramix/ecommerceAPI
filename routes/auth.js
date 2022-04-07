const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")


// async function:
//basically, we use async function here because it takes couple of time to save new user in mongoDB 
//and our code run instantly without waiting for saving new user. 

//REGISTER
router.post("/register", async (req, res) => {


  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // making hashed password with crypto-JS, it shold be converted to string 
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
  });


  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }

});

//______________________________________________________________________________________________________


//Login
router.post("/login", async (req,res) => {

// For Login we should check firstly if there is any user with that username in databace,
// if yes the we should check whether password match or not
    try{
        // find user in database  which has username comes from request
        const user = await User.findOne({username: req.body.username});
        // If there was not any username like that in database return 
        !user && res.status(401).json("Wrong User Name")
        


        //we should decrpt hashed password of user, so we can compare it to inputed password
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        ); 
        // converting to string
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); 
        // getting inputed password
        const inputPassword = req.body.password;  
        //comparing to password in database
        originalPassword !== inputPassword && res.status(401).json("Wrong password") 
        
        //making accessToken which is valid for 3 days 
        const  accessToken = jwt .sign({
            id: user._id,
            isAdmin: user.isAdmin
        },process.env.JWT_SEC,
        {expiresIn:"3d"});

        // if we send user as json lots of information will come wich include password too, 
        // so in order to prevent it we should cut password from it
        const {password, ...others} = user._doc;
        res.status(200).json({...others,accessToken})



    }catch(err){
        res.status(500).json(err)
        console.log(err);
    }
})




module.exports = router;