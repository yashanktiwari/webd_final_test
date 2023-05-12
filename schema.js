const mongo=require('mongoose')


const userSchema= mongo.model('User', new mongo.Schema({
    email: String,
    password: String,
    url:String,
    following:Array,
    uid:String,
    name:String,
    date:String,
}))

const tweetSchema= mongo.model('Tweet', new mongo.Schema({
    tweet: String,
    uid: String,
    likes: Array,
    tid:String,
    name:String,
    url:String,
    date:String,
}))


module.exports ={
    userSchema,
    tweetSchema
}