var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'www123!@#',
  database : 'pinkblue',
  queueLimit : 0, // unlimited queueing
  connectionLimit : 0 // unlimited connections
});
connection.connect();
// console.log("connectionis --",connection);

module.exports = connection;
