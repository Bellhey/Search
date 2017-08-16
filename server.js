/**
 * Created by admin on 2017/7/25.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('./config/express');

const app = express();
app.listen(3000);
module.exports = app;

process.on('uncaughtException', function (err) {
    "use strict";
    console.log(err);
    console.log(err.stack);
});
console.log('Server running at http://localhost:3000/');
