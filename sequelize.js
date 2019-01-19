var sqlite3 = require('sqlite3'),
	dbFile = process.env.DB_DIR || "databases/core.db",
    db = new sqlite3.Database(dbFile);
var Sequelize = require('sequelize'),
    sequelize = new Sequelize('database', 'username', 'password', {
  // sqlite! now!
  dialect: 'sqlite',
 
  // the storage engine for sqlite
  // - default ':memory:'
  storage: dbFile
});

module.exports = sequelize
