var Xinge = require('./lib/Xinge');

var accessId  = 2100113114;
var secretKey = 'e0528825cfa4b091733c01e2ae18f5f1';
var XingeApp = new Xinge.XingeApp(accessId, secretKey);

//Android message start.
var style = new Xinge.Style();
style.ring = 1;
style.vibrate = 0;
style.ringRaw = 'a';
style.smallIcon = 'b';
style.builderId = 77;

var action = new Xinge.ClickAction();
action.actionType = Xinge.ACTION_TYPE_ACTIVITY;
action.packageName.packageName = 'com.iweje.weijian';
// action.packageName.packageDownloadUrl = 'http://a.com';
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
//  'name': 'huangnaiang'
//};
// androidMessage.multiPkg = 0;
//androidMessage.loopTimes = 3;
//androidMessage.loopInterval = 2;
//And message end.

//IOS message start.

//iOSMessage.loopTimes = 3;
//iOSMessage.loopInterval = 2;
//IOS message end.

function pushMsg(deviceID, content) {
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = '微见';
    androidMessage.content = content;
    androidMessage.style = style;
    androidMessage.action = action;
    // androidMessage.sendTime = Date.parse('2014-02-19 15:33:30') / 1000;
    // androidMessage.expireTime = 0;
    androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
    // androidMessage.customContent = {
    //  'name': 'huangnaiang'
    // };
    androidMessage.multiPkg = 0;
    androidMessage.loopTimes = 3;
    androidMessage.loopInterval = 2;

    XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
        if (err) {
            console.log(err);
        }
    }); 
}

// pushMsg('88b79f73807a9d2147bb9742672749243d6b732d', '2222');

//推送消息给指定设备
var testDevice = 'cc06bc7b28747451c85ebd28f591ee7b69d4fdd8898d056f4191b85c4d293c49';
exports.pushMsgToDevice = function(deviceID, content){
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_MESSAGE;
    //androidMessage.title = 'a';
    androidMessage.content = content;
    //androidMessage.style = style;
    //androidMessage.action = action;
    // androidMessage.sendTime = Date.parse('2014-02-19 15:33:30') / 1000;
    // androidMessage.expireTime = 0;
    androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
    // androidMessage.customContent = {
    //  'name': 'huangnaiang'
    // };
    androidMessage.multiPkg = 0;
    androidMessage.loopTimes = 3;
    androidMessage.loopInterval = 2;

    XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
        if (err) {
            console.log(err);
        }
    });
};

exports.pushNotification = function(deviceID, content){
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = '微见';
    androidMessage.content = content;
    androidMessage.style = style;
    androidMessage.action = action;
    // androidMessage.sendTime = Date.parse('2014-02-19 15:33:30') / 1000;
    // androidMessage.expireTime = 0;
    androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
    // androidMessage.customContent = {
    //  'name': 'huangnaiang'
    // };
    androidMessage.multiPkg = 0;
    androidMessage.loopTimes = 3;
    androidMessage.loopInterval = 2;

    XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
        if (err) {
            console.log(err);
        }
    });
};

exports.pushMsgToAccount = function(account, content){
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_MESSAGE;
    androidMessage.content = content;
    androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
    androidMessage.multiPkg = 0;
    androidMessage.loopTimes = 3;
    androidMessage.loopInterval = 2;

    XingeApp.pushToSingleAccount(account, androidMessage, function(err, result){
    });
};


// //推送消息给指定账户或别名
// XingeApp.pushToSingleAccount('account', androidMessage, function(err, result){
//  console.log(result);
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
//  console.log(result);
// });

// //批量查询消息推送状态
// XingeApp.queryPushStatus(['2824'], function(err, result){
//  console.log(result);
// });

// //查询设备数量
// XingeApp.queryDeviceNum(function(err, result){
//  console.log(result);
// });

// //查询tag
// XingeApp.queryTags(0, 100, function(err, result){
//  console.log(result);
// });

// //取消未触发的定时任务
// XingeApp.cancelTimingTask(718, function(err, result){
//  console.log(result);
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