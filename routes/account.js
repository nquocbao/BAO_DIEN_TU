var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../models/user.model');
var restricted = require('../middlewares/restricted');

var router = express.Router();

// dang ky tai khoan
router.get('/register', (req, res, next) => {
  res.render('vwAccount/Register');
})

router.post('/register', (req, res, next) => {
  var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

  var entity = req.body;
  entity.f_Password = hash;
  entity.f_DOB = dob;
  entity.f_Permission = 0;
  entity.photo = 'user.png'
  var d = new Date();
  entity.DaySignUp = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' 
  + d.getMinutes() + ':' + d.getSeconds();
  
  d.setDate(d.getDate() + 7);
  entity.DayDeadline = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' 
  + d.getMinutes() + ':' + d.getSeconds();
  delete entity.password;
  delete entity.confirm;
  delete entity.dob;
  userModel.add(entity).then(id => {
    res.redirect('/account/login');
  })
})

router.get('/is-available', (req, res, next) => {
  var user = req.query.user;
  userModel.singleByUserName(user).then(rows => {
    if (rows.length > 0)
      res.json(false);
    else res.json(true);
  })
})

router.get('/login', (req, res, next) => {
  res.render('vwAccount/login', {
    layout: false
  }
  );
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      return res.render('vwAccount/login', {
         layout: false,
        err_message: info.message
      })
    }

     var retUrl = req.query.retUrl || '/';
    req.logIn(user, err => {
      if (err)
        return next(err);

      return res.redirect(retUrl);
    });
  })(req, res, next);
})

router.post('/logout', restricted, (req, res, next) => {
  req.logout();
  res.redirect('/account/login');
})

router.get('/profile/:id', restricted, (req, res, next) => 
{
  var id = req.params.id;
  userModel.single(id).then( rows =>
  {   
      var profile = rows[0];
      res.render('vwAccount/profile', {error:false, profile});
  });
})

router.get('/changepassword/:id',restricted, (req, res, next) => {
  res.render('vwAccount/changepassword');
})
router.post('/changepassword/:id', (req, res, next) => 
{
  var id = req.params.id;
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      return res.render('vwAccount/changepassword', {
        err_message: info.message
      })
    }
    //
    var saltRounds = 10;
      var hash = bcrypt.hashSync(req.body.newpassword, saltRounds);
      var entity = req.body;
      entity.f_Password = hash;
  
      delete entity.username;
      delete entity.password;
      delete entity.newpassword;
      delete entity.confirm;
      
    userModel.update(entity, id).then(id => {
      var retUrl = req.query.retUrl || '/';
      req.logIn(user, err => {
        if (err)
          return next(err);
        return res.redirect(retUrl);
      });
    });
  })(req, res, next);
 
})


router.get('/forgotpassword', (req, res, next) => {
  res.render('vwAccount/forgotpassword');
})

router.post('/forgotpassword', (req, res, next) =>
{
   var entity = req.body
    // tao password ngau nhien khi forgot
  var iteration = 0;
  var password = "";
  var randomNumber;
  var special = false;
  while(iteration < 6){
    randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
    if(!special){
      if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
      if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
      if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
      if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
    }
    iteration++;
    password += String.fromCharCode(randomNumber);
  }
  // gui mail
   userModel.confirmEmail(entity.f_Email).then(rows =>
    {
      if(rows.length > 0)
        {
          var user = rows[0];
          var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport('smtps://nguyenquocbao248824%40gmail.com:ilovenodejS2@smtp.gmail.com');
          var mailOptions = {
          from: '"baodientu" <foo@blurdybloop.com>', // sender address
          to: entity.f_Email, // list of receivers
          subject: '[BAODIENTU] Thông tin đăng nhập tài khoản', // Subject line
          text: 'Reset Password', // plaintext body
          html: `<div>
            <p>Kính chào bạn ` + user.f_Name + `</p>
            <p>Thông tin đăng nhập mới của bạn trên baodientu là:</p>
            <p>Tên đăng nhập: ` + user.f_Username + `<br> Mật khẩu: ` + password + `</p>
            <p>Trân trọng,</p>
            <p>----------<br>
            Hệ thống Quản lý Báo Điện Tử<br>
            Đồ án sinh viên CNTT <br> Đại học Khoa học Tự nhiên - ĐHQG TP. Hồ Chí Minh<br>
            </div>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log("loi");
      }
      console.log('Message sent: ' + info.response);
  });
    
    // update mat khau vua tao

    var saltRounds = 10;
    var hash = bcrypt.hashSync(password, saltRounds);
    
    entity.f_Password = hash;
  
    delete entity.f_Email;    
    userModel.update(entity, user.f_ID).then(id => {
        return res.redirect('/account/login');
    }) 
  }
  ///------------------------
  else
  {
    return res.send('Your Email not true, you please check your email !!');
    
  }
})
})


router.get('/editUser/:id', restricted, (req, res, next) => {
  var id = req.params.id;
  userModel.single(id).then( rows =>
  {   
      var editprofile = rows[0];
      res.render('vwAccount/editUser', {error:false, editprofile});
  });
})

router.post('/editUser/:id', restricted, (req, res, next) =>
{
  var fdob = moment(req.body.fdob, 'DD/MM/YYYY').format('YYYY-MM-DD');
  var id = req.params.id
  var entity = req.body;
  
  entity.f_DOB = fdob;
  entity.f_ID = id;
  delete entity.fdob;
  // console.log(entity);

  userModel.update(entity,entity.f_ID).then(id =>
  {
    return res.redirect(`/account/profile/${entity.f_ID}`);
  }) 
 
})

router.get('/users',restricted, (req, res, next) => {
  userModel.all().then( rows => 
    {
        res.render('vwAccount/users', {
                    error: false,
                    empty: rows.length === 0,
                    allUsers:rows });
                }).catch(next);
})

router.get('/editpermission/:id', restricted, (req, res, next) => 
{
  var id = req.params.id;
  userModel.single(id).then( rows =>
  {   
      var editpermission = rows[0];
      res.render('vwAccount/editPermission', {error:false, editpermission});
  });
})

router.post('/editpermission/:id', restricted, (req, res, next) =>
{
  var id = req.params.id
  var entity = req.body;
  entity.f_ID = id;

  userModel.update(entity,entity.f_ID).then(id =>
  {
    return res.redirect(`/account/users`);
  }) 
})

router.get('/loadphoto/:id', restricted, (req, res, next) => 
{
  var id = req.params.id;
  userModel.single(id).then( rows =>
  {   
      var uploadphoto = rows[0];
      res.render('vwAccount/uploadphoto', {error:false, uploadphoto});
  });
})

router.post('/loadphoto/:id', restricted, (req, res, next) => 
{
  var id = req.params.id;
  var entity = req.body;
  //console.log(entity);
  //res.end('werety');
  if(entity.photo == '')
  {
    delete entity.photo;
  }
  entity.f_ID = id;
  var i = id;
  userModel.update(entity,entity.f_ID).then(id =>
  {
    return res.redirect(`/account/profile/${i}`);
  })
})
// danh sach tai khoan user 
router.get('/renewal', restricted, (req, res, next) => {
 
  userModel.checktk().then( rows =>
  {   
      var giahan = rows;
      res.render('vwAccount/accountRenewal', {error:false, giahan});
  });
})
// gai han tai khoan user 7 ngay

router.post('/renewal/:id',  (req, res, next) =>
{
  function parseDate(str)
  {
     var mdy = str.split('/');
     return new Date(mdy[2], mdy[1], mdy[0]);
   }
   var id = req.params.id;
   var entity = req.body;
  var t = entity.tg;
   var n = Number(entity.number);
  
   var temp = parseDate(t);
   temp.setDate(temp.getDate() + n);
   entity.DayDeadline = temp.getFullYear() + '/' + temp.getMonth() + '/' + temp.getDate();

   delete entity.number;
   delete entity.tg;
   userModel.update(entity, id).then( rows =>
   {   
     res.redirect('/account/renewal');
   });
 
})
// huy gia han bai viet
router.post('/delrenewal/:id',  (req, res, next) =>
{
  
   var id = req.params.id;
  
   var temp = new Date();
   var entity = req.body;
   temp.setDate(temp.getDate() - 1);
   entity.DayDeadline = temp.getFullYear() + '/' + (temp.getMonth()+1) + '/' + (temp.getDate());
   userModel.update(entity, id).then( rows =>
   {   
     res.redirect('/account/renewal');
   });
 
})
module.exports = router;
