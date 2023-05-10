require('dotenv').config()
const mongoose=require('mongoose');

const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
const registrationSchema=new mongoose.Schema({
  name: {
      type: String,
      required:true,
  },
  email:{
      type:String,
      required:true,
      unique:true
  },
  phone:{
    type:Number,
    required:true,
    unique:true

  },
  password:{
    type:String,
    required:true
  },
  confirm_password:{
    type:String,
    required:true
  },
  tokens:[{token:{type:String,required:true}}]

})

// generating tokens
registrationSchema.methods.generateAuthToken=async function(){
  try{
   const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
   console.log(token)
   this.tokens=this.tokens.concat({token:token})
   await this.save()
   return token
  }
  catch(err)
  {
    res.send("generated authtoken error"+err)
    console.log(err)
  }
}



//converting password into hash
registrationSchema.pre("save",async function(next){
  
  if(this.isModified("password"))
  { 
  console.log(`the current password is ${this.password}`)
  this.password=await bcrypt.hash(this.password,10)
  this.confirm_password=await bcrypt.hash(this.confirm_password,10)
  console.log(this.password)
  console.log(this.confirm_password)
  // this.confirm_password=undefined
  }
  next()

})


const Registration= new mongoose.model("Registration",registrationSchema);

module.exports=Registration;
