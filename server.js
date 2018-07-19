const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session')
require('./db/db');


// setup session
app.use(session({
  secret: 'this is a random secret string that you make up', //secret is a key that allows the server to unlock the cookie when we hear back from the client
  resave: false, //only save when the session object has been modified
  saveUninitialized: false //useful for login session, we only want to save when we modify the session
}));


// Set up middleware
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


const userController = require('./controllers/userController.js');
const photoController = require('./controllers/photoController.js');
const authController = require('./controllers/auth.js');

// set up controller routes
app.use('/auth', authController);
app.use('/users', userController);
app.use('/photos', photoController);




app.get('/', (req, res) => {
  res.render('index.ejs');
});



app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
