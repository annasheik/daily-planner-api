const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL, CLIENT_ORIGIN} = require('./config');
//const {Task} = require('./models');

//CORS
const cors = require('cors');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

 

 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

 module.exports = {app};