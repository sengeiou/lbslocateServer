var server_options={'auto_reconnect':true,poolSize:5,connectTimeoutMS:60000,socketTimeoutMS:60000};
var db_options={w:-1};//{safe: true}
var Settings = require('../settings'),
	Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;
var lbsDb = new Db('lbsDB', new Server(Settings.DB_HOST, Settings.DB_PORT, server_options), db_options);
lbsDb.open(function(err,db){
	if(err)throw err;
});
module.exports = lbsDb;
