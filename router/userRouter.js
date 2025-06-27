import express, { request } from "express";
import { addUserController , viewUserController,updateUserPageController, updateUserPostController,deleteUserController,userDashboardController, userSearchController} from "../controller/userController.js";




var userRouter = express();

userRouter.get('/home',(request,response)=>{
   response.render("home");
});
userRouter.get('/addUser',(request,response)=>{
   response.render("addUser");
});
userRouter.post('/addUser',addUserController);
userRouter.get('/viewUser',viewUserController);
userRouter.get('/update/:email',updateUserPageController); // Show form
userRouter.post('/updateUser',updateUserPostController);   // Handle update
userRouter.get('/delete/:email', deleteUserController);
userRouter.get('/dashboard', userDashboardController);
userRouter.post('/search', userSearchController);
export default userRouter;