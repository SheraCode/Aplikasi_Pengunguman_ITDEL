const mongoose = require('mongoose');
const { urlDb } = require('../config');

mongoose.connect(urlDb, {
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to database!");
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
})
.catch((err) => {
  console.error("Connection error:", err);
});
const db = mongoose.connection;

module.exports = db;
