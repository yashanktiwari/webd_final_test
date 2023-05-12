const express = require("express");
const { ifLogin } = require("../util");
const router = express.Router();
const bcrypt = require("bcryptjs");
const {userSchema:user} = require('../schema');
const shortid = require('shortid');
const {isLogin} = require('../util');
const {tweetSchema:tweet} = require('../schema');

router.get('/homepage',async function (req, res){
    const tweets=await tweet.find({});
    res.render('home',{tweets});
})

router.get('/',isLogin,async function(req,res){
    const me=await user.findOne({uid:req.session.uid}); 
    const mytweet=await tweet.find({uid:req.session.uid});
    var alltweets = await tweet.find({});
    alltweets=alltweets.filter(tweet => tweet.uid !== req.session.uid);
    const getUser=await user.findOne({uid:req.session.uid});
    const followtweets = await tweet.find({uid:{ $in: me.following }});



    res.render('main',{mytweet,alltweets,followtweets,getUser});
})

router.post('/follow',isLogin,async function(req,res){
    const {newuid}=req.body;
    const getUser=await user.findOne({uid:req.session.uid});
    getUser.following.push(newuid);
    await getUser.save();
    res.redirect(req.get('referer'));
})
router.post('/unfollow',isLogin,async function(req,res){
    const {newuid}=req.body;
    var getUser=await user.findOne({uid:req.session.uid});
    getUser.following=getUser.following.filter(uid => uid !== newuid);
    await getUser.save();
    res.redirect(req.get('referer'));
})
router.post('/like',isLogin,async function(req,res){
    const {tid} = req.body;
    const ftweet = await tweet.findOne({tid});
    if(ftweet.likes.includes(req.session.uid)){
        res.send('already liked')
    }
    else{
    ftweet.likes.push(req.session.uid);
    await ftweet.save();
    res.send('sucess')
    }
   
})


router.post('/tweet',isLogin,async function(req,res){
    const {tweet:tweetText}=req.body;
    const getUser=await user.findOne({uid:req.session.uid});
    console.log(getUser)
    const d=new Date();
    const newTweet=new tweet({
        tweet:tweetText,
        uid:req.session.uid,
        tid:shortid.generate(),
        date:d.toLocaleString(),
        name:getUser.name,
        url:getUser.url
    })
    await newTweet.save();
    res.redirect('/');
});

router.get('/user/:uid',isLogin,async function(req,res){
    const {uid}=req.params;
    const getUser=await user.findOne({uid});
    const me=await user.findOne({uid:req.session.uid});
    var isFollowed=false;
    if(me.following.includes(uid)){
        isFollowed=true;
    }
   console.log(isFollowed)
    delete getUser.password
    const tweets=await tweet.find({uid});
    res.render('user',{getUser,tweets,isFollowed});
})


module.exports = router;
