/**
 * Created by admin on 2017/7/25.
 */
const config = require('./config'),
       mysql = require('mysql');
const connection = mysql.createConnection(config.db.mysql);
module.exports = connection;