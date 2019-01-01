'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { DATABASE_URL, PORT } = require('./config');
const {BlogPosts} = require('./models');


const app = express();

// log the http layer
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

 app.get('/posts', (req, res) => {
   BlogPosts
      .find()
      .then( posts => {
       res.json(posts.map(post => post.serialize()));
      })
      .catch(err => {
       res.status(500).json({ error: "something went terribly wrong"});
      });
   
 });



let server;


function runServer(DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}


if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
