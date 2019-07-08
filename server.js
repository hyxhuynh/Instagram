const express = require('express');
const mongoose = require('mongoose');
// const users = require('./routes/api/users');
// const profile = require('./routes/api/profile');
// const posts = require('./routes/api/posts');
// const bodyParser = require('body-parser');
// const passport = require('passport');
const app = express();

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));

// Passport middleware
// app.use(passport.initialize());

// Passport config
// require('./config/passport')(passport)

// Body parser middleware
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// First route
app.get('/', (req, res) => res.send('Hello'));

// app.use('/api/users', users);
// app.use('/api/profile', profile);
// app.use('/api/posts', posts);


const port = 5002;
app.listen(port, () => console.log(`Server is running on port ${port}`));