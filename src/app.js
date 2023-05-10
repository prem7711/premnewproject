require('dotenv').config()
const express=require('express');
const hbs=require('hbs');
const path=require('path');
const app=express();
const bcrypt = require('bcrypt');

require("./db/conn");

const Registration=require("./models/registration")

const port=process.env.PORT||3000;

app.use(express.json())
  
app.use(express.urlencoded({
    extended:false
}))

 const templatesPath=path.join(__dirname,"./templates/views");

 const partialsPath=path.join(__dirname,"./templates/partials");



const staticPath=path.join(__dirname,"../public")
app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",templatesPath);
hbs.registerPartials(partialsPath);




app.get("/",(req,res)=>{
    res.render("registration");

})

app.get("/register",(req,res)=>{
    res.render("registration");

})

app.post("/register",async(req,res)=>{
   try{
      const password=req.body.password
      const c_password=req.body.confirm_password



      if(password===c_password)
      {
        const registerEmployee=new Registration({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            confirm_password:req.body.confirm_password
           })


           const token=await registerEmployee.generateAuthToken()

           console.log("token created")
           console.log(token)


           const registered=await registerEmployee.save()
           res.render("home")


      }
      else
      {
        res.send("passwords are not matching")
      }
       
   }

   catch(err){
      res.status(400).send(err)

   }
})

// const securepassword=async (password)=>{
//     const hashpassword=await bcrypt.hash(password,10)
//     console.log(hashpassword)
//     const matching=await bcrypt.compare("123",hashpassword)
//     console.log(matching)
// }

// securepassword("1234");


app.get("/login",(req,res)=>{
    res.render("login");

})

app.post("/login",async(req,res)=>{
   try{
       const password=req.body.password
       const email=req.body.email

       const usermail= await Registration.findOne({email:email})


      const isMatch= await bcrypt.compare(password,usermail.password)

      
       if(isMatch)
       {
        console.log("hii")
        const token=await usermail.generateAuthToken()

         console.log("token created")
         console.log(token)

        res.status(201).render("home")
       }
       else
       {
        res.send("invalid details")
       }
       console.log("logged in")
    //    res.render("home")
   }

   catch(err){
      res.status(400).send(err)

   }
})


// var jwt = require('jsonwebtoken');

// const createToken=async ()=>{
//     const token =await jwt.sign({_id:"64553f9ac094bd4a5f4b04a2"},"mynameisprem",{expiresIn:"2 seconds"})
//     console.log(token)

//     const userVerified=await jwt.verify(token,"mynameisprem")
//     console.log(userVerified)
// }

// createToken();

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})
// $2b$10$Xo2m2qMiSehD3Bz/O90wQe4SmislSHty60o04zbcCm.cjjBvY70oa
