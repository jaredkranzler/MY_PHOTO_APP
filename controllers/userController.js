const express = require('express');
const router  = express.Router();

//-------------------------------------------------------------------------
// Require the model
const User  = require('../models/users');
const Photo = require('../models/photos');
//-------------------------------------------------------------------------


//-------------------------------------------------------------------------
// INDEX
router.get('/', async (req, res, next) => {

  try {

    const foundUsers = await User.find({})
    res.render('users/index.ejs', {
      users: foundUsers

    });    
  } catch (err){
    console.log("is there an error index route catch", err)
    next(err)
  }
});


//-------------------------------------------------------------------------
// NEW
router.get('/new', (req, res) => {
  res.render('users/new.ejs');
});


//-------------------------------------------------------------------------
// SHOW
router.get('/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render('users/show.ejs', {
      user: foundUser
    });
  });
});


//-------------------------------------------------------------------------
// EDIT
router.get('/:id/edit', async (req, res) => {

  try {

    const foundUser = await  User.findById(req.params.id);
    res.render('users/edit.ejs', {
      user: foundUser
    });
  } catch (err) {

    res.send(err)
    }
});


//-------------------------------------------------------------------------
// PUT (UPDATE)
router.put('/:id', async (req, res) => {

  try{ 

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.redirect('/users');
  } catch (err) {

    res.send(err)
    }
});


//-------------------------------------------------------------------------
// POST CREATE
router.post('/', async (req, res) => {


  try {

    const createdUser = await User.create(req.body);
    res.redirect('/users');
  } catch (err) {

    res.send(err)
    }
});


//-------------------------------------------------------------------------
// DELETE
// DELETE AN User DELETE THE ASSOCIATED Photos
router.delete('/:id', async (req, res) => {

  try {

    const deletedUser = await User.findByIdAndRemove(req.params.id);
    // We are collecting all of the Photo Ids from the deletedUsers
    // photos property
    const photoIds = [];
    for(let i = 0; i < deletedUser.photos.length; i++){
      photoIds.push(deletedUser.photos[i].id);
    }

    const data = await Photo.remove({_id: { $in: photoIds}});
    res.redirect('/users');
  } catch (err) {

    res.send(err)
    }
});

//-------------------------------------------------------------------------
module.exports = router;
//-------------------------------------------------------------------------




