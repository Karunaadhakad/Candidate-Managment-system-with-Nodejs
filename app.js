import express, { request, response } from "express";
import userRouter from "./router/userRouter.js";
import path from 'path';
import { fileURLToPath } from 'url';
import expressFileUpload from 'express-fileupload';


var app = express();

 
app.use(expressFileUpload());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("views","views");
app.set("view engine","ejs");
app.use(express.static('public'));

app.get("/",(request,response)=>{
   response.render("home.ejs");
});
app.use('/user',userRouter);

app.listen(3000,(request,response)=>{
    console.log("Server connection successfull established");
});
