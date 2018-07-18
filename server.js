const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
require('./db/db');

// Set up middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


const userController = require('./controllers/userController.js');
const photoController = require('./controllers/photoController.js');

// set up controller routes
app.use('/users', userController);
app.use('/photos', photoController);

app.get('/', (req, res) => {
  res.render('index.ejs');
});



app.listen(3000, () => {
  console.log('App is listening on port 3000');
});
