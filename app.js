const express = require("express");
const app = express(); 
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "#4QWERTYGKLN876843[]sskd/(shal)?2001";

mongoURL = "mongodb+srv://shalini:2001@cluster1.hytlkge.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURL,{
    useNewUrlParser:true
}).then(()=>{console.log("connected to database");})
.catch((e)=> console.log(e));

require("./userDetails");
const User = mongoose.model("userInfo");

app.post("/register",async(req,res)=>{
    const {fname,lname,email,password,userType} = req.body;

    const encryptedPassword = await bcrypt.hash(password , 10);
    try{
        const oldUser = await User.findOne({email});
        if(oldUser){
          return res.send({status : "user exists"});
        }
        //used to store the data entered in the form to mongodb 
      await User.create({
        fname,
        lname,
        email,
        password: encryptedPassword,
        userType
      });
      res.send({status : "Ok"})
    }
    catch(error){
      res.send({status : "error"})
    }
})

app.post("/login-user",async(req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.json({error : " User not found"});
  }
  if(await bcrypt.compare(password, user.password)){
    const token = jwt.sign({email : user.email},JWT_SECRET,{expiresIn : "15m"});

    if(res.status(201)){
      return res.json({status : "ok" , data : token});
    }
    else{
      return res.json({error : "error"});
    }

  }
  res.json({status : "error", error : "invalid password"});
});

app.post("/userData", async(req,res)=>{
  const {token} = req.body;
  try{
    const user = jwt.verify(token,JWT_SECRET);
    const useremail = user.email;
    User.findOne({email : useremail}).then((data)=>{
      res.send({status : "ok", data : data});
    })
    .catch((error)=>{
      res.send({status : "error" , data : error});
    });
  }
  catch(error){
    
  }
})


app.listen(5000,()=>{
    console.log("Server Started");
})

/*app.post("/post",async(req,res)=>{
    console.log(req.body);
    const {data} = req.body;


})

require("./userDetails");

const User = mongoose.model("userInfo");

app.post("./register",async(req,res)=>{
    const {firstname,lastname,emaill,passwordd} = req.body;
    try{
     await User.create({
        fname : firstname,
        lname : lastname,
        email : emaill,
        password : passwordd
     });
     res.send({status : "ok"})
    }
    catch(error){
      res.send({status:"ERROR"})
    }
});

*/