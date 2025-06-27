import express from "express";
import userModel from "../model/userModel.js";
import { fileURLToPath } from 'url';
import expressFileUpload from 'express-fileupload';
import path from 'path';
 
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

export const addUserController = async(request,response)=>{
   

    try{
    
             var filename = request.files.myImage;
             var fileName = new Date().getTime()+filename.name;
              
             var pathName = path.join(__dirname,'../public/images/',fileName);
             filename.mv(pathName,async(error)=>{
                          if(error){
                                         console.log("Error while uploading file",error);
                                   }
                          else{
                                   console.log("File uploaded succefully");
                             
                                   var userObj = {
                                                     username : request.body.username,
                                                     email: request.body.email,
                                                     password:request.body.password,
                                                     address:request.body.address,
                                                     myImage:fileName
                                              }
                                                   var res = await userModel.create(userObj);
                                                   console.log("Data inserted successfully",res);
                                                  const userData = await userModel.find();
                                                  response.render("viewUser",{mess:"Add User",userData:userData,findUser:""});
}
 });


  }catch(error){
                     
                      console.log("Error occured in adduser controller",error);
                      response.render("viewUser",{mess:"something went wrong in add user",userData,findUser:""});
                                        
                                        
    }
    
}
export const viewUserController = async(request,response)=>{
    
    try{
           
            const userData = await userModel.find();
            console.log("User Data:",userData);
            response.render("viewUser",{mess:"",userData:userData,findUser:""});
           
            
    }catch(error){
                    
                      console.log("Error occured in viewuser controller",error);
                   response.render("viewUser",{mess:"something went wrong",userData,findUser:""});
                                        
    }
    
}
export const updateUserPageController = async (request, response) => {
  try {
    const userEmail = request.params.email;
    const user = await userModel.findOne({ email: userEmail });

    if (user) {
      response.render("updateUser", { user: user ,mess:""}); // Pass user data to form
    } else {
       response.render("updateUser", { user: user ,mess:"User not found"}); 
    }
  } catch (error) {
    console.log("Error in updateUserPageController:", error);
    response.render("updateUser", { user: user ,mess:"Error loading update page"}); 
  }
}
export const updateUserPostController = async (request, response) => {
  try {
    const { username, email, password, address, oldImage } = request.body;

    let imageName = oldImage; // default to old image

    if (request.files && request.files.myImage) {
      const image = request.files.myImage;
      imageName = image.name;
      await image.mv("public/images/" + imageName);
    }

    await userModel.updateOne(
      { email: email },
      {
        $set: {
          username,
          email,
          password,
          address,
          myImage: imageName,
        },
      }
    );

    const userData = await userModel.find();
    response.render("viewUser", { mess: "User Updated", userData,findUser:""});

  } catch (error) {
    console.log("Error in updateUserPostController:", error);
    const userData = await userModel.find(); // to avoid undefined
    response.render("viewUser", { mess: "Update failed", userData,findUser:""});
  }
};



export const deleteUserController = async (request, response) => {
  try {
    const userEmail = request.params.email;

    const deletedUser = await userModel.deleteOne({ email: userEmail });

    if (deletedUser.deletedCount === 1) {
      const userData = await userModel.find();
      response.render("viewUser", { mess: "User Deleted Successfully", userData,findUser:""});
    } else {
      response.render("viewUser", { mess: "User Not Found", userData,findUser:""});
    }
  } catch (error) {
    console.log("Error in deleteUserController:", error);
    response.render("viewUser", { mess: "Error Deleting User", userData,findUser:""});
  }
};

export const userDashboardController = async (request, response) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const recentUsers = await  userModel.find().sort('-_id').limit(5);

    response.render("dashboard", {totalUsers,recentUsers});
  } catch (error) {
    console.log("Dashboard error:", error);
    response.render("dashboard", {totalUsers: 0,recentUsers: [],mess: "Something went wrong!",});
  }
};


export const userSearchController = async (request, response) => {
  try {
    const searchTerm = request.body.search.trim();

    // Search by username or email using regex (case-insensitive)
    const findUser = await userModel.find({
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } }
      ]
    });

    const userData = await userModel.find(); // For fallback/full list

    if (findUser.length > 0) {
      response.render("viewUser", { mess: `Found ${findUser.length} user(s)`, userData, findUser });
    } else {
      response.render("viewUser", { mess: "No matching user found", userData, findUser: [] });
    }

  } catch (error) {
    console.error("Search error:", error);
    response.render("viewUser", { mess: "Error during search", userData: [], findUser: [] });
  }
};



