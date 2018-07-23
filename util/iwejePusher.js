var SessionManager = require('../models/sessionManager.js')
var androidPusher = require('./androidPusher.js');
var iosPusher = require('./iosPusher.js');
var Friend = require('../models/friend.js');

exports.pushMsg = function(userID, msgContent, msgType) {
	SessionManager.getPushID(userID, function(err, pushInfo) {
		if (pushInfo && pushInfo.PushID != '') {
			if (pushInfo.D == '0') {
				androidPusher.pushMsgToDevice(pushInfo.PushID, msgType);	
			}
			else if (pushInfo.D == '1') {
				iosPusher.pushMsg(pushInfo.PushID, msgContent, msgType);	
			}
		}	
	});	
}

exports.pushMsgToOne = function(userID, msgContent) {
	SessionManager.getPushID(userID, function(err, pushInfo) {
		if (pushInfo && pushInfo.PushID != '') {
			if (pushInfo.D == '0') {
				androidPusher.pushNotification(pushInfo.PushID, msgContent);	
			}
			else if (pushInfo.D == '1') {
				iosPusher.pushMsg(pushInfo.PushID, msgContent, '1');	
			}
		}	
	});	
}

exports.pushMsgToFriends = function(userID, msgContent) {
	Friend.getAllF(userID, function(err, docs){
		if (err || !docs) {
			return;
		}
		docs.forEach(function(doc) {
			SessionManager.getPushID(doc.FID, function(err, pushInfo) {
				if (pushInfo && pushInfo.PushID != '') {
					if (pushInfo.D == '0') {
						androidPusher.pushNotification(pushInfo.PushID, msgContent);	
					}
					else if (pushInfo.D == '1') {
						iosPusher.pushMsg(pushInfo.PushID, msgContent, '1');	
					}
				}	
			});
		});
	});
}