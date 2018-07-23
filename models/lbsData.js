var lbsDB = require('./lbsDB');
var Settings = require('../settings');
var Util = require('../util/util.js');
var ObjectID = require('mongodb').ObjectID;
function LBSData() {
};

module.exports = LBSData;

LBSData.saveCellAddr = function saveCellAddr(mcc, mnc, cellAddr, callback) {	
	var table = 'Cell' + mcc + '_' + mnc;
	lbsDB.collection(table, function(err, collection) {
		collection.insert(cellAddr, {safe: true}, function(err, cellAddr) {
			return callback(err);
		});		
	});
};

LBSData.updateCellAddr = function updateCellAddr(mcc, mnc, lac, cellID, cellAddr, callback) {	
	var table = 'Cell' + mcc + '_' + mnc;
	lbsDB.collection(table, function(err, collection) {
		if (err) {
			return callback(err, null);
		}
		collection.update({Lac:lac,Cell:cellID}, {$set:cellAddr}, function(err) {
			return callback(err, doc);
		});	
	});
};

LBSData.getCellAddr = function getCellAddr(mcc, mnc, lac, cellID, callback) {	
	var table = 'Cell' + mcc + '_' + mnc;
	lbsDB.collection(table, function(err, collection) {
		if (err) {
			return callback(err, null);
		}
		collection.findOne({Lac:lac,Cell:cellID}, function(err, doc) {
			return callback(err, doc);
		});				
	});
};

