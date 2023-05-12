const express = require("express");
const { ifLogin } = require("../util");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {userSchema:user} = require('../schema');
const shortid = require('shortid');
router.get("/login",  function (req, res) {
  res.render("login");
});

router.post("/login", async function (req, res) {
  const { email, password } = req.body;
  const getUser =await  user.findOne({ email });
    if (!getUser) {
        res.status(400).send("User not found");
    }
    else{
        if(bcrypt.compareSync(password, getUser.password)){
            req.session.uid=getUser.uid;
            req.session.email=getUser.email;
            console.log(req.session)
           
            res.redirect("/");
        }
        else{
            res.status(400).send("Wrong Password");
        }
    }

});


router.get("/register", function (req, res) {
    res.render("register");
})

router.post("/register", async function (req, res) {
    const { email, password ,url,name} = req.body;
    const uid=shortid.generate();
    
    const newuser=new user({
        email,
        password:bcrypt.hashSync(password, 10),
        url,
        uid,
        name,
        date: new Date()
    })

    await newuser.save();
    res.redirect("/login");

})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/login');
})
module.exports = router;
