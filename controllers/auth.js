const express = require('express');
const router  = express.Router();
const Auth    = require('../models/auth');
const bcrypt  = require('bcrypt')

router.get('/', (req, res) => {
  
  res.render('auth/login.ejs', {
    message: req.session.message
  })

})



// --------------------------------------------------------------------
// LOG IN
router.post('/login', (req, res) => {

  Auth.findOne({username: req.body.username}, (err, auth) => {
    
    if(auth){
      // if the auth was found
        if (bcrypt.compareSync(req.body.password, auth.password)){


          // req.session is "!available on every single request from the client!!"
          //our session is available in the following object
          // console.log(req.session);
          
          //you can add any property you want to the session
          // ass soon as you do its saved to the store
          req.session.username = auth.username
          req.session.loggedIn = true;
          req.session.message = " ";
          res.redirect('/photos')

        } else {

          req.session.message = "Username or password is incorrect"
          res.redirect('/auth')
        }

    } else {

      req.session.message = "Username or password is incorrect"
      res.redirect('/auth')
    }// end of if user
  })
});



// --------------------------------------------------------------------
// REGISTER
router.post('/register', (req, res) => {
  
  // HASH Our Password so we dont know what it is
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  
  // creat an object to tenter into the user model
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash;

  // create entry into the database (the first argement is what we want to put into the database and the rest is the response)
  Auth.create(userDbEntry, (err, auth) => {
    req.session.username = auth.username;
    req.session.loggedIn = true;
    res.redirect('/users')
  })
});


// --------------------------------------------------------------------
// logging out or destroying the session
router.get('/logout', (req, res) => {
  
  req.session.destroy((err) => {
    if(err){
      // do something
      res.send('err destroying session');
    } else {
      res.redirect('/auth')
    }
  });
});




// --------------------------------------------------------------------
module.exports = router;
// --------------------------------------------------------------------











