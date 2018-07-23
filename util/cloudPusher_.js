var http = require('http');
var querystring = require('querystring');
var crypto = require('crypto');
var urlencode=require('urlencode');
var apiKey='wWW3zGiGlaet9CGijDz5M7gF';
var screctKey='urO3rfZUZGTxwSaZp452oVSnCwAE3qPI';
var method='POST';
var HOST='channel.api.duapp.com';
var param='/rest/2.0/channel/channel';
var host='channel.api.duapp.com/rest/2.0/channel/channel';
// start('');
exports.pushMsg = function(userID, content){
    var pushtype=1;
    var message_type=0;//0消息透传，1通知
    // var message=JSON.stringify([{"title":"msg","description":"helloworld",custom_content:{id:'1',type:0}}]);
    var message = JSON.stringify([content]);
    var msg_key=JSON.stringify(['msg']);
    //var id='756496964269904518';
    var query={};
    query={
        push_type: (typeof pushtype ==='number')?pushtype:0,
        user_id:userID,//'756496964269904518',
        message_type:(typeof message_type ==='number')?message_type:0,
        messages:message,
        msg_keys:msg_key
    };
    pushQuery(query);
}
function getTimestamp() {           //生成时间戳
    var timestamp = Math.floor(new Date().getTime() / 1000);
    return timestamp;
}
function getSign(string) {             //百度签名算法
    var baseStr = method +"http://"+host+string;
    baseStr += screctKey;
    var encodeStr = urlencode(baseStr);
 
    var md5sum = crypto.createHash('md5');
    md5sum.update(encodeStr);
    var sign = md5sum.digest('hex');
    console.log(sign);
    return sign;
}
function productArray(options){       //讲一个对象生成字符串
     var string='';
      var array=[];
      for(var key in options){
         array.push(key+"="+options[key]);
      }
     array.sort();
     for(var i=0;i<array.length;i++){
         string+=array[i];
     }
    return string;
}
function pushQuery(query){                   //推送消息
     query.method='push_msg';
     query.apikey = apiKey;
     query.timestamp=getTimestamp();
     var string= productArray(query);
     var sign=getSign(string);
     var queryString=[];
     query.sign=sign;
    var num=0;
     for(var key in query){
         queryString.push(key+'='+urlencode(query[key]));
         num++;
     }
    var querys=queryString.join('&');
    var options={
        host:'channel.api.duapp.com' ,
        method: 'POST',
        path: '/rest/2.0/channel/channel',
        headers: {'Content-Length': querys.length,
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };
    var req = http.request(options, function (res) {
        console.log('status = ' + res.statusCode);
        console.log('res header = ');
        console.dir(res.headers);
        var resBody = '';
        res.on('data', function (chunk) {
            resBody += chunk;
        });
 
        res.on('end', function () {
                console.log('res body: ' + resBody);
 
            var jsonObj = JSON.parse(resBody);
            var errObj = null;
            if (res.statusCode != 200) {
 
             console.log(">>>>>>>>>err")
            }
 
            console.log(jsonObj)
        });
    });
 
    req.write(querys);
    req.end();
}