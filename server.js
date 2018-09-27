const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL, CLIENT_ORIGIN} = require('./config');
const passport = require('passport');
const router = express.Router();
const faker = require('faker');

const app = express();

const { router: tasksRouter } = require('./tasks');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

app.use(morgan('common'));

//CORS
const cors = require('cors');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/tasks/', tasksRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});
 
// RUN / CLOSE SERVER

let server;


function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if(err) {
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
};



module.exports = {app, runServer, closeServer};