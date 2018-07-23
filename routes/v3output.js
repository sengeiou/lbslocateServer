var logger = require('../log').logger;
var Util = require('../util/util.js');
var Settings = require('../settings.js');

function packRetData(dataInfo) {
	if (!dataInfo) {
		return '';
	}
	else {
		if (Util.isArray(dataInfo)) {
			dataInfo = {data:dataInfo};
		}
	}	
	return JSON.stringify(dataInfo);
}

exports.sendRes = function(resObj, req, res) {
	var err = resObj.Err;
	var descInfo = resObj.Desc;
	if (!descInfo) {
		descInfo = req.method + ' ' + req.url;
	}
	var dataInfo = resObj.Data;
	var retCode = resObj.Ret;
	if (!retCode) {
		retCode = 0;
		if (err) {
			retCode = -1;
		}
	}

	dataInfo = packRetData(dataInfo);
	var userInfo = {};
	if (req.session && req.session.user) {
		userInfo = req.session.user;
	}
	var recv = '';
	if (req.body) {
		if (req.get('Content-Type') == 'application/json') {
			recv = JSON.stringify(req.body);
		}
		else {
			recv = require('querystring').stringify(req.body);
		}
	}
	else if (req.query) {
		recv = require('querystring').stringify(req.query);
		if (recv == '') {
			recv = JSON.stringify(req.query);
		}
	}
	if (err) {
		logger.error('user:' + JSON.stringify(userInfo) + ',recv:' + recv + ',headers:' + JSON.stringify(req.headers) + 
			',response:' + dataInfo + ',desc:' + descInfo + ',err:' + err);
		res.writeHead(200, {"ret": retCode, 'err':encodeURI(err), 'Content-Type': 'text/plain;charset=utf-8'});
		res.write(dataInfo);
		res.end();
	}
	else {
		logger.debug('user:' + JSON.stringify(userInfo) + ',recv:' + recv + ',headers:' + JSON.stringify(req.headers) + 
			',response:' + dataInfo + ',desc:' + descInfo);			
		if (req.url == '/agps' || req.url == '/agps2') {
			res.writeHead(200, {"ret": retCode, 'Content-Type': 'text/plain;', 'Api':resObj.Data.Api, 'Len':resObj.Data.Len});
			res.write(resObj.Data.Data);
		}
		else {
			res.writeHead(200, {"ret": retCode, 'Content-Type': 'text/plain;charset=utf-8'});
			res.write(dataInfo);
		}
		res.end();
	}
}