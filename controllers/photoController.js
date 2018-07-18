const express = require('express');
const router = express.Router();

//-------------------------------------------------------------------------
// Require the model
const Photo = require('../models/photos');
const User  = require('../models/users');
//-------------------------------------------------------------------------


//-------------------------------------------------------------------------
// INDEX
router.get('/', async (req, res, next)=>{

  try {

    const foundPhotos = await Photo.find({});
    res.render('photos/index.ejs', {
      photos: foundPhotos
    });
  } catch (err){

    next(err)

    }
});


//-------------------------------------------------------------------------
// NEW
router.get('/new', (req, res)=>{
  User.find({}, (err, allUsers) => {
    res.render('photos/new.ejs', {
      users: allUsers
    });
  });
});


//avoid this handling /new by placing it towards the bottom of the file
//-------------------------------------------------------------------------
// Display the User with a Link on the Photo show page
// SHOW
router.get('/:id', (req, res)=>{
  Photo.findById(req.params.id, (err, foundPhoto)=>{
    // WE need to find The user of the photo
    User.findOne({'photos._id': req.params.id}, (err, foundUser) =>{

      res.render('photos/show.ejs', {
          photo: foundPhoto,
          user: foundUser
      });
    });
  });
});


//-------------------------------------------------------------------------
//EDIT
router.get('/:id/edit', async (req, res) => {


  try {

    const foundPhoto = await Photo.findById(req.params.id);
    // Find all the users, so we can select them in the drop down menu
    // when we are editing   
    const allUsers = await User.find({});
    // Then we need to find THe user the photo is by
    const foundPhotoUser = await User.findOne({'photos._id': req.params.id});
    res.render('photos/edit.ejs', {
      photo: foundPhoto,
      users: allUsers,
      photoUser: foundPhotoUser
    });

  } catch (err) {

    res.send(err)

    }
});


//-------------------------------------------------------------------------
//POST (CREATE)
router.post('/', async (req, res)=>{

  try {

    // Create a new Photo , Push a copy into the Users photo's array
    const foundUser = await User.findById(req.body.useerId);
    // foundUser is the document, with user's photos array
    const createdPhoto = await Photo.create(req.body);
    foundUser.photos.push(createdPhoto);
    const data = await foundUser.save()
        res.redirect('/photos');

  } catch (err) {

    res.send(err)

    }
});



//-------------------------------------------------------------------------
// DELETE
router.delete('/:id', async (req, res)=>{

  try {

    const foundPhoto = await Photo.findByIdAndRemove(req.params.id);
    // Finding the user with that photo
    const foundUser = await User.findOne({'photos._id': req.params.id});
    // Finding the photo in the users array and removing it
    foundUser.photos.id(req.params.id).remove();
    const data = await foundUser.save()
    res.redirect('/photos');


  } catch (err){

    res.send(err)

    }
});


//-------------------------------------------------------------------------
// PUT (UPDATE)
// UPDATE AND Photo WE ALL WANT TO UPDATE THE Users Photo LIST
router.put('/:id', async (req, res)=>{

  try {

    const updatedPhoto = await Photo.findByIdAndUpdate(req.params.id, req.body, {new: true});
    // Find the user with that photo
    const foundUser = await User.findOne({'photos._id': req.params.id});
    // Saying there is a new user
    if(foundUser._id.toString() !== req.body.userId){
      foundUser.photos.id(req.params.id).remove();
      const savedFoundUser = await foundUser.save();
      // Find the new user and and the photo to thier array
      const newUser = await User.findById(req.body.userId)
      newUser.photos.push(updatedPhoto);
      const savedFoundUserNew = await newUser.save();
      res.redirect('/photos');
    } 
    else {
      // If the user is the same as it was before
      // first find the photo and removing, req.params.id = photos id
      foundUser.photos.id(req.params.id).remove();
      foundUser.photos.push(updatedPhoto);
      const data = await foundUser.save();
      res.redirect('/photos');
    }

  } catch (err) {

    res.send(err)
    }
});


module.exports = router;

