require('dotenv').config()

const express=require('express');
const app=express();
const path=require('path');

const useRoute=require("./routers/user")
const blogRoute=require("./routers/blog")

const Blog=require("./models/blog");

const cookieParser = require('cookie-parser')
const { urlencoded } = require('body-parser');
const {checkForAuthenticationCookie}=require("./middlewares/authentication");

const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URL).then(()=> console.log("Database Created!")).catch(err => console.log(err));

const PORT=process.env.PORT || 8000;

// console.log(process.env.PORT,process.env.MONGO_URL);

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false})); //formdata
app.use(cookieParser()); //for cookie
app.use(checkForAuthenticationCookie("token")); //check token and give payload, (cookie name token)
app.use(express.static(path.resolve("./public"))); // tell express to serve public statically

app.get("/", async (req,res) => {
    const allBlogs= await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });//sending user details to home page
})

app.use("/user", useRoute);
app.use("/blog", blogRoute);

app.listen(8000, () => {console.log("server running at port 8000!")});