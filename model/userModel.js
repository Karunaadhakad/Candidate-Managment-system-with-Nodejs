import mongoose from "mongoose";
import url from "../connection/dbConfig.js";

mongoose.connect(url);

const UserModel = mongoose.Schema({
  
    username:{
            type:String,
            required:true
    },
    email:{
             type:String,
             required:true
    },
    password:{
             type:String,
             required:true
    },
    address:{
                 type:String,
                 required:true
    },
    myImage:{
        type : String,
        required : true,
       
    }

});

export default mongoose.model('userModel',UserModel,'user');


