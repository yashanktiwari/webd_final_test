const express=require('express');
const app=express();
require('dotenv').config();
const port=process.env.PORT || 3000;
const mongo=require('mongoose');
var session = require('express-session')
const auth = require('./routes/auth');
const twitter=require('./routes/tweet');

// Connect to MongoDB
mongo.connect(process.env.MONGODB_URI_CLOUD, {useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
    console.log('Connected to MongoDB');
}).catch(function(err){
    console.log(err);
});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');



app.use(auth);
app.use(twitter);



app.listen(port,err=>{
    if(err) throw err;
    console.log('Server is running on port: '+port);
});

