const express = require('express');
const mongoose = require('mongoose');
const app = express();

const db = require('./config/keys').mongoURI;
mongoose
  .connect(db)
  .then(() => console.log('MongoDb connected'))
  // if failed, incorrect password or did not whitelist IP address
  .catch(err => console.log(err));

// First route
app.get('/', (req, res) => res.send('Hello'));
const port = 5002;
app.listen(port, () => console.log(`Server running on port ${port}`));