import express from "express";
import session from "express-session";
import userRouter from "./router/userRouter.js";
import path from 'path';
import { fileURLToPath } from 'url';
import expressFileUpload from 'express-fileupload';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Session middleware
app.use(session({
    secret: 'mySecretKey',
    responseave: false,
    saveUninitialized: true
}));

app.use(expressFileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

// ===== Middleware for authentication =====
function isAuthenticated(request, response, next) {
    if (request.session && request.session.isLoggedIn) {
        next();
    } else {
        response.redirect('/');
    }
}

// ===== LOGIN PAGE =====
app.get("/", (request, response) => {
    response.render("login");
});

// ===== LOGIN HANDLER =====
app.post("/login", (request, response) => {
    const { email, password } = request.body;

    // Dummy check — you can replace this with DB check
    if (email === "admin@gmail.com" && password === "admin@123") {
        request.session.isLoggedIn = true;
        response.redirect("/user/home");
    } else {
        response.send("Invalid credentials. <a href='/'>Try Again</a>");
    }
});

// ===== LOGOUT =====
app.get("/logout", (request, response) => {
    request.session.destroy(() => {
        response.redirect("/");
    });
});

// ===== Protected Routes =====
app.use("/user", isAuthenticated, userRouter);

app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});