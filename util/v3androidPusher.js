var Xinge = require('./lib/Xinge');

var accessId  = 2100206444;
var secretKey = 'f9c7603b027dc8f4dbd03ef70736e0ed';
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
action.packageName.packageName = 'com.xcloudtech.locate';
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

function pushMsg(deviceID, content, customObj) {
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
    androidMessage.customContent = customObj;
    try {
        XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
            if (err) {
                console.log(err);
            }
            //console.log('done ' + (count++));
        });        
    }
    catch (e) {
        console.log('pushMsgToDevice failed:' + e);
    }
}

//var count = 0;
function pushNotificationMsg(deviceID, content, customObj) {
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = '防走丢';
    androidMessage.content = content.toString();
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
    androidMessage.customContent = customObj;
    try {
        XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
            if (err) {
                console.log(err);
            }
            //console.log('done ' + (count++));
        });        
    }
    catch (e) {
        console.log('pushNotification failed:' + e);
    }
}

//pushMsg('ccf85c6ec8b1403044a7a8fd1e91a033befcb307', 'save', 4);
// for (var i = 0; i < 100; i++) {
//     pushMsg('ec34c73a85f4682b42939a5bce95b28a81352b1e', 'wake', 5);    
// }

//pushNotificationMsg('ccf85c6ec8b1403044a7a8fd1e91a033befcb307', 'wake', 5);

//推送消息给指定设备
exports.pushMsgToDevice = function(deviceID, content, customObj){
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_MESSAGE;
    //androidMessage.title = 'a';
    androidMessage.content = content.toString();
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
    androidMessage.customContent = customObj;//{T:msgType.toString()};
    try {
        XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
            if (err) {
                console.log(err);
            }
        });        
    }
    catch (e) {
        console.log('pushMsgToDevice failed:' + e);
    }
};

exports.pushNotification = function(deviceID, content, customObj){
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = '防走丢';
    androidMessage.content = content.toString();
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
    androidMessage.customContent = customObj;
    try {
        XingeApp.pushToSingleDevice(deviceID, androidMessage, function(err, result){
            if (err) {
                console.log(err);
            }
        });        
    }
    catch (e) {
        console.log('pushNotification failed:' + e);
    }
};

exports.pushMsgByDevices = function(arr, content, customObj){
    var androidMessage = new Xinge.AndroidMessage();
    androidMessage.type = Xinge.MESSAGE_TYPE_MESSAGE;
    androidMessage.content = content.toString();
    androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
    androidMessage.multiPkg = 0;
    androidMessage.loopTimes = 3;
    androidMessage.loopInterval = 2;
    androidMessage.customContent = customObj;//{T:msgType.toString()};

    // var androidMessage = new Xinge.AndroidMessage();
    // androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
    // androidMessage.title = '防走丢';
    // androidMessage.content = content.toString();
    // androidMessage.style = style;
    // androidMessage.action = action;
    // // androidMessage.sendTime = Date.parse('2014-02-19 15:33:30') / 1000;
    // // androidMessage.expireTime = 0;
    // androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
    // // androidMessage.customContent = {
    // //  'name': 'huangnaiang'
    // // };
    // androidMessage.multiPkg = 0;
    // androidMessage.loopTimes = 3;
    // androidMessage.loopInterval = 2;
    // androidMessage.customContent = customObj;

    
    XingeApp.createMultiPush(androidMessage, function(err, result) {
        if (err) {
            console.log(err);
        }
        try {
            var obj = JSON.parse(result);
            if (obj.result && obj.result.push_id) {
                XingeApp.pushByDevices(JSON.stringify(arr), obj.result.push_id, function(err, result){
                    if (err) {
                        console.log(err);
                    }
                });                  
            }
        }
        catch (e) {
            console.log('pushMsgToDevice failed:' + e + ',' + result);
        }        
    });
};
//pushMsgByDevices(["ea73a79c602db4a944298a6b12641881e02a297e"], 'dfdafd', {T:'5'});
//pushMsg("ea73a79c602db4a944298a6b12641881e02a297e", 'dfdafd', {T:'5'});
//pushNotificationMsg('6d368fc49402b8a64079b85f7e4c05fbda8bc02b', 'wake', {T:'1'});

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