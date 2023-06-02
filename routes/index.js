var express = require('express');
var router = express.Router();

var passport = require('passport')
const userModel = require('./users');
const productModel = require('./products')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const storage = require('../config/config');
const userupload = multer({ storage: storage.userimagestorage })
const productupload = multer({ storage: storage.productimagestorage })


const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))

router.get('/',  function(req, res, next) {
  var tot =  productModel.find()
  
 console.log(tot.length)
  var temp = tot.length/4;
  console.log(temp);
  temp = Math.ceil(Number(temp))
  console.log(temp);
  res.render('index', { title: 'Express' });
});
router.get('/main',isloggedIn, async function(req,res){
  var tot = await productModel.find()
  
 console.log(tot.length)
  var temp = tot.length/4;
  console.log(temp);
  temp = Math.ceil(Number(temp))
  console.log(temp);
if(req.query.page<temp){
  var skip = req.query.page || 0;
}else{
  skip=0;
}
  
 var user = await  userModel.findOne({username:req.session.passport.user})
 var prod = await  productModel.find().populate('sellerid').limit(4).skip(skip*4)
      skip= Number(skip) + 1;
      res.render('main',{data:user,product:prod , skip:skip})
    })
   
 
//  router.get('/main',isloggedIn,function(req,res){
//   userModel.findOne({username:req.session.passport.user}).then(function(user){
//     res.render('main',{data:user})
//   })

//  })
router.post('/register',function(req,res){
 var user = new userModel(
  {
  name:req.body.name,
  username:req.body.username,
  email:req.body.email,
  Number:req.body.Number,
  sellor:req.body.sellor
  }
 )
 userModel.register(user,req.body.password).then(function(user){
      passport.authenticate('local')(req,res,function(users){
        {
          res.redirect('/main')
        }
      })
 })
}
)
router.post('/login',passport.authenticate('local',{
  successRedirect:"/main",
  failureRedirect:"/"
}),function(req,res){

})

router.get('/logout',function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

router.get('/profile', isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).populate('products').then(function(data){
    res.render('profile',{user:data})
  })
})

function isloggedIn(req,res,next){
if(req.isAuthenticated()){
  return next();
}
else(
  res.redirect('/')
)
}




//SECONDARY ROUTES



router.get('/verified',isloggedIn,function(req,res){
   userModel.findOne({username:req.session.passport.user}).then(function(user){
         res.render('verified',{data:user})
   })
})
router.post('/verified',isloggedIn,function(req,res){
   userModel.findOneAndUpdate({username:req.session.passport.user},{gstno:req.body.gstno,address:req.body.address}).then(function(user){
       res.redirect('/profile');
   })
})

router.post('/uploads',isloggedIn,userupload.single('image'),function(req,res){
  userModel.findOneAndUpdate({username:req.session.passport.user},{image:req.file.filename}).then(function(data){
   res.send(data)
  })
  
})




router.post('/create/product',isloggedIn,productupload.array('image',6),function(req,res){
  userModel.findOne({username:req.session.passport.user}).then(function(user){ 
    productModel.create(
      {
     sellerid: user._id,
     prodname:req.body.productname,
     image:req.files.map(elem=> elem.filename),
     desc:req.body.desc,
     price:req.body.price,
     discount:req.body.discount
      }
    ).then(function(product){
       user.products.push(product._id);
       user.save();
       res.redirect('/profile')
    })
  })
  
})

router.get('/edit/product/:id',isloggedIn,function(req,res){
  productModel.findOne({_id:req.params.id}).then(function(product){
    res.send(product);
  })
})


router.post('/edit/product/:id',isloggedIn,function(req,res){
  productModel.findOne({_id:req.params.id}).then(function(product){
    res.send(product);
  })
})


router.get('/delete/product/:id',isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).then(function(user){})
  productModel.findOne({_id:req.params.id}).populate('sellerid').then(function(product){})
  if(user.username === product.sellerid.username ){
      productModel.findOneAndDelete({_id:req.params.id}).then(function(){
      })
      userModel.findOne({username:req.session.passport.user}).then(function(data){
       data.products.splice(user.products.indexOf(product._id,1));
       data.save();
      })
      res.redirect(back);
  }
  else{
    res.send('you cannnot delete it !!!!')
  }
})



module.exports = router;
