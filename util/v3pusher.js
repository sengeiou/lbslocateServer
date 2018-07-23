var SessionManager = require('../models/v3sessionManager.js')
var androidPusher = require('./v3androidPusher.js');
var iosPusher = require('./v3iosPusher.js');
var Settings = require('../settings');
var Resource = require('../resource.js');

function genContent(msg, lan) {
	var content =  '[' + msg.Name + ']' + msg.Content;
	if (lan == '1') {
		switch (Number(msg.Action)) {
			case Settings.ACTION_ADD:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_ADD_GROUP', 1) + '[' + msg.GName + ']';
			break;
			case Settings.ACTION_AGREE:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_JOIN_GROUP', 1) + '[' + msg.GName + ']';
			break;
			case Settings.ACTION_DEL:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_DEL_GROUP', 1) + '[' + msg.GName + ']';
			break;
			case Settings.ACTION_QUIT:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_QUIT_GROUP', 1) + '[' + msg.GName + ']';
			break;
			case Settings.ACTION_REMOVE:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_REMOVE_MEMBER', 1) + '[' + msg.GName + ']';
			break;
			case Settings.ACTION_OUT:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_OUT_FENCE', 1) + '[' + msg.BName + ']';
			break;
			case Settings.ACTION_IN:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_IN_FECNCE', 1) + '[' + msg.BName + ']';
			break;
			case Settings.ACTION_HELP:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_HELP', 1);
			break;
			case Settings.ACTION_CHECKIN:
			content = '[' + msg.Name + ']' + Resource.getString('STR_SEND_CHECKIN', 1);
			break;
			default:
			break;
		}
	}
	return content;
}

exports.pushMsg = function(msg, msgType) {
	SessionManager.getPushID(msg.UFID, function(err, pushInfo) {
		if (pushInfo && pushInfo.PushID != '') {
			if (pushInfo.D == '0') {
				androidPusher.pushMsgToDevice(pushInfo.PushID, genContent(msg, pushInfo.L), {T:msgType.toString()});	
			}
			else if (pushInfo.D == '1') {
				iosPusher.pushMsg(pushInfo.PushID, genContent(msg, pushInfo.L), {T:msgType.toString()});	
			}
		}	
	});	
}

exports.pushHiddenMsg = function(uid, content, msgType) {
	SessionManager.getPushID(uid, function(err, pushInfo) {
		if (pushInfo && pushInfo.PushID != '') {
			if (pushInfo.D == '0') {
				androidPusher.pushMsgToDevice(pushInfo.PushID, content, {T:msgType.toString()});	
			}
			else if (pushInfo.D == '1') {
				iosPusher.pushMsg(pushInfo.PushID, content, {T:msgType.toString()});	
			}
		}	
	});	
}

exports.pushChat = function(userID, msgContent, msgType, ctype, obj) {
	SessionManager.getPushID(userID, function(err, pushInfo) {
		if (pushInfo && pushInfo.PushID != '') {
			if (pushInfo.D == '0') {
				androidPusher.pushMsgToDevice(pushInfo.PushID, msgContent, {T:msgType.toString(), CType:ctype.toString(), ID:obj});	
			}
			else if (pushInfo.D == '1') {
				iosPusher.pushMsg(pushInfo.PushID, msgContent, {T:msgType.toString(), CType:ctype.toString(), ID:obj});	
			}
		}	
	});	
}

function pushSystemMsgToOneUser(userID, msgContent) {
	SessionManager.getPushID(userID, function(err, pushInfo) {
		var msgType = Settings.XG_SYSTEM;
		if (pushInfo && pushInfo.PushID != '') {
			if (pushInfo.D == '0') {
				androidPusher.pushNotification(pushInfo.PushID, msgContent, {T:msgType.toString()});	
			}
			else if (pushInfo.D == '1') {
				iosPusher.pushMsg(pushInfo.PushID, msgContent, {T:msgType.toString()});	
			}
		}	
	});		
}

exports.pushMsgToOne = function(userID, msgContent) {
	pushSystemMsgToOneUser(userID, msgContent);
}

exports.pushMsgToFriends = function(uidList, msgContent) {
	uidList.forEach(function(uid) {
		pushSystemMsgToOneUser(uid, msgContent);
	});
}

exports.pushMsgByAccounts = function(userIDList, msgContent, msgType) {
	SessionManager.getPushIDList(userIDList, function(err, andDocs, iosDocs) {
		if (andDocs && andDocs.length > 0) {
			//console.log('andriod:' + JSON.stringify(andDocs));
			androidPusher.pushMsgByDevices(andDocs, msgContent, {T:msgType.toString()});
		}
		//if (iosDocs && iosDocs.length > 0) {
			//console.log('ios:' + JSON.stringify(iosDocs));
			//iosPusher.pushMsgByAccounts(iosDocs, msgContent, {T:msgType.toString()});	
		//}
	});
}