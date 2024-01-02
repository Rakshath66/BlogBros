//router and controller
const {Router}=require("express");
const router = Router();
const User=require("../models/user");

router.get("/signin", (req,res) => {
    return res.render("signin");
})

router.get("/signup", (req,res) => {
    return res.render("signup");
})

router.post("/signin", async (req,res) => {
    const {email, password} = req.body;
    try{
        // console.log(email, password);
        const token = await User.matchPasswordAndGenerateToken(email, password);
        // console.log("Token",token);
        return res.cookie("token", token).redirect("/");//cookie name token
    }
    catch(error){
        return res.render("signin",{
            error: "Incorrect Email or Password",
        });//passing error property if wrong password, error written in any views(nav)
    }
})

router.get("/logout", (req,res) => {
    res.clearCookie('token').redirect("/");
})

router.post("/signup", async (req,res) => {
    // console.log(req.body);
    const {fullName, email, password} = req.body;
    try{
        await User.create({
            fullName,
            email,
            password,
        });
        return res.redirect("/");
    }
    catch(error){
        return res.render("signup",{
            error: "Fill All Details",
        });//passing error property if wrong password, error written in any views(nav)
    }
})

module.exports=router;