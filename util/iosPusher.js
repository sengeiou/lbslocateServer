var Xinge = require('./lib/Xinge');

var accessId  = 2200113070;
var secretKey = 'b712927f0033018d31650effe782164b';
var XingeApp = new Xinge.XingeApp(accessId, secretKey);
var settings = require('../settings');

//Android message start.
var style = new Xinge.Style();
style.ring = 1;
style.vibrate = 0;
style.ringRaw = 'a';
style.smallIcon = 'b';
style.builderId = 77;

var action = new Xinge.ClickAction();
action.actionType = Xinge.ACTION_TYPE_ACTIVITY;
//action.packageName.packageName = 'com.demo.xg';
//action.packageName.packageDownloadUrl = 'http://a.com';
//action.packageName.confirm = 1;

// var androidMessage = new Xinge.AndroidMessage();
// androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
// androidMessage.title = 'a';
// androidMessage.content = 'v';
// androidMessage.style = style;
// androidMessage.action = action;
// androidMessage.sendTime = Date.parse('2014-02-19 15:33:30') / 1000;
// androidMessage.expireTime = 0;
//androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
//androidMessage.customContent = {
//	'name': 'huangnaiang'
//};
// androidMessage.multiPkg = 0;
//androidMessage.loopTimes = 3;
//androidMessage.loopInterval = 2;
//And message end.

//IOS message start.

//iOSMessage.loopTimes = 3;
//iOSMessage.loopInterval = 2;
//IOS message end.
var testDevice = '7ffc8e258cb7640fcb53ac128affb17b4a6e630bd228297c3616a9a9a87733ae';
function pushMsgToD(deviceID, content, msgType){
// function pushMsg(deviceID, content) {
	var iOSMessage = new Xinge.IOSMessage();
	iOSMessage.alert = content;
	iOSMessage.badge = 1;
	// iOSMessage.sound = 'df';
	//iOSMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 0));
	iOSMessage.customContent = {
	    T: msgType
	};
	XingeApp.pushToSingleDevice(deviceID, iOSMessage, settings.XING_IOS_ENV, function(err, result){
		// console.log(result);
		if (err) {
			console.log(err);
		}
	});
};

//推送消息给指定设备
// pushMsgToD(testDevice, 'xxxx', 'xxxxx');
exports.pushMsg = function(deviceID, content, msgType){
// function pushMsg(deviceID, content) {
	var iOSMessage = new Xinge.IOSMessage();
	iOSMessage.alert = content;
	iOSMessage.badge = 1;
	iOSMessage.sound = 'df';
	iOSMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 0));
	iOSMessage.customContent = {
	    T: msgType
	};
	XingeApp.pushToSingleDevice(deviceID, iOSMessage, settings.XING_IOS_ENV, function(err, result){
		// console.log(result);
		if (err) {
			console.log(err);
		}
	});
};


// //推送消息给指定账户或别名
// XingeApp.pushToSingleAccount('account', androidMessage, function(err, result){
// 	console.log(result);
// });

// //推送消息给批量账号
// XingeApp.pushByAccounts(['a', 'b'], androidMessage, function(err, result){
//     console.log(result);
// });

// //推送消息给所有设备
// XingeApp.pushToAllDevices(iOSMessage, Xinge.IOS_ENV_DEV, function(err, result){
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// });

// //推送消息给指定tag
// XingeApp.pushByTags(['av'], Xinge.TAG_OPERATION_OR, iOSMessage, Xinge.IOS_ENV_DEV, function(err, result){
// 	console.log(result);
// });

// //批量查询消息推送状态
// XingeApp.queryPushStatus(['2824'], function(err, result){
// 	console.log(result);
// });

// //查询设备数量
// XingeApp.queryDeviceNum(function(err, result){
// 	console.log(result);
// });

// //查询tag
// XingeApp.queryTags(0, 100, function(err, result){
// 	console.log(result);
// });

// //取消未触发的定时任务
// XingeApp.cancelTimingTask(718, function(err, result){
// 	console.log(result);
// });

// //批量设置标签
// XingeApp.setTags([['tag1','token1'], ['tag2','token2']], function(err, result){
//     console.log(result);
// });

// //批量删除标签
// XingeApp.deleteTags([['tag1','token1'], ['tag2','token2']], function(err, result){
//     console.log(result);
// });

// //根据设备token查询tag
// XingeApp.queryTagsByDeviceToken('token1', function(err, result){
//     console.log(result);
// });

// //根据tag查询设备数
// XingeApp.queryDeviceNumByTag('tag1', function(err, result){
//     console.log(result);
// });