const userModel = require('../Models/userModel');
const bodyParser = require("body-parser");
const Helper =require('../Helper/Helper')
const jwt = require('jsonwebtoken')
const { machineId } = require('node-machine-id');
const si = require('systeminformation');

exports.createUser = async (req, res) => {
    try {
       
        const { email, password,machineId } = req.body;

        if(email!='' && password!='' && machineId!=''){
            var new_user = userModel.create({
                username:email,
                password:password,
                email:req.body.email?req.body.email:"",
                machineId:machineId
            })
        Helper.response("Success","User Created Successfully",{},res,200); 
        }
        else {
            Helper.response("Success","Something went wrong!",{},res,200);          
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.Login = async(req,res)=>{
    try{
        const {username,password}=req.body;
        if(!username||!password){
           return  Helper.response("Failed","Please provide Username and Password",{},res,200)
        }
        const user = await userModel.findOne( { username: username} );
      
        if (user && user.password==password){
           console.log(1)
            let token= jwt.sign({ id:user._id }, process.env.SECRET_KEY, {
                expiresIn: "50m",
              });
              Helper.updateToken(user._id,token)
              .then((data)=> {
                Helper.response("Success","Logged In successfully.",{ 
                    id: user.id,
                    username: user.username,
                    token: token,
                    base_url: process.env.BASE_URL,
                  },
                  res,
                  200
                );
              })
        }else{
            Helper.response("Failed","Invalid Username or Password",{},res,200)
        }
    }catch(err){
        console.log(err)
    }
}
exports.getMachineId= async(req,res)=>{
    try {
       
        const { machineId } = req.body;
        console.log(machineId,"machineid")
        if(machineId!=''){
        
        const user = await userModel.findOne({where:{ machineId:machineId }});
        if(user){
            Helper.response("Success","Machine Id verified",{},res,200)

        }else{
            Helper.response("Failed","User not Registered",{},res,200)
        }
    }
    else{
        Helper.response("Failed","machineId is required",{},res,200)
    }
    } catch (error) {
        console.log(error)
        Helper.response("Failed","Internal Server Error",{error},res,200)
    }
}