/**
 * Created by Tim on 9/25/2017.
 */
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

//db Setup
const user = 'user';
const PW = 'Password567';
const dbName = 'testproject30';
const mongoDB = `mongodb://${user}:${PW}@ds149324.mlab.com:49324/${dbName}`;

mongoose.connect(mongoDB);

app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);


//server setup

const port = process.env.PORT || 3091;
const server = http.createServer(app);

server.listen(port);
console.log(`Server listening on: ${port}`);