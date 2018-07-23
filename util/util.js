var settings = require('../settings');
var util = require('util');

Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		'M+': this.getMonth() + 1, //月份 
		'd+': this.getDate(), //日 
		'h+': this.getHours(), //小时 
		'm+': this.getMinutes(), //分 
		's+': this.getSeconds(), //秒 
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度 
		'S': this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	return fmt;
}

function Util() {
};

//获取日期，主要用于历史集合名
Util.getStrDay = function getStrDay() {
	return (new Date().Format('yyyyMMdd'));
};

Util.getStrDate = function getStrDate() {
	return (new Date().Format('yyyy-MM-dd hh:mm:ss'));
};

Util.getStrDate2 = function getStrDate2() {
    return (new Date().Format('yyyy-MM-dd'));
};

Util.getDayFromStrDate = function getDayFromStrDate(strDate) {
	if (!strDate || strDate.length < 10) {
		return Util.getStrDay();
	}
	return strDate.substr(0, 4) + strDate.substr(5, 2) + strDate.substr(8, 2);
};

//dateStr格式为“2014-05-08 00:22:11”
Util.getTimeFromStrDate = function getTimeFromStrDate(dateStr)
{
	var newstr = dateStr.replace(/-/g,'/'); 
	var date =  new Date(newstr);
	return date.getTime();
};

// console.log(Util.getTimeFromStrDate('2014-05-08 00:22:12'));

Util.getStrDayFromDate = function getStrDayFromDate(date) {
	return date.Format('yyyyMMdd');
};

Util.getStrDateFromDate = function getStrDateFromDate(date) {
    return date.Format('yyyy-MM-dd hh:mm:ss');
};

Util.getStrDay2FromDate = function getStrDayFromDate(date) {
    return date.Format('yyyy-MM-dd');
};

Util.getYesterday = function getYestoday(date){       
    var yesterday_milliseconds = date.getTime() - 1000*60*60*24;        
    var yesterday = new Date();        
    yesterday.setTime(yesterday_milliseconds);
    var strYear = yesterday.getFullYear();     
    var strDay = yesterday.getDate();     
    var strMonth = yesterday.getMonth()+1;   
    if (strMonth < 10) {
    	strMonth='0'+strMonth;     
    }     
    datastr = strYear + strMonth + strDay;   
    return datastr;   
 };

 Util.getYesterdate = function getYesterdate(date){       
    var yesterday_milliseconds = date.getTime() - 1000*60*60*24;        
    var yesterday = new Date();        
    yesterday.setTime(yesterday_milliseconds);
    var strYear = yesterday.getFullYear();     
    var strDay = yesterday.getDate();     
    var strMonth = yesterday.getMonth()+1;   
    if (strMonth < 10) {
        strMonth='0'+strMonth;     
    }     
    datastr = strYear + '-' + strMonth + '-' + strDay;   
    return datastr;   
 };

//函数名：CheckDateTime
//功能介绍：检查是否为日期时间
 Util.isDateTime = function isDateTime(str){
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if(r==null)return false;
    r[2]=r[2]-1;
    var d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);
    if(d.getFullYear()!=r[1])return false;
    if(d.getMonth()!=r[2])return false;
    if(d.getDate()!=r[3])return false;
    if(d.getHours()!=r[4])return false;
    if(d.getMinutes()!=r[5])return false;
    if(d.getSeconds()!=r[6])return false;
    return true;
}

// console.log(Util.isDateTime('2015-1023 00:00:00'));


function GUID() {
    this.date = new Date();

    /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID != 'function') {
        
        /* 生成GUID码 */
        GUID.prototype.newGUID = function() {
            this.date = new Date();
            var guidStr = '';
                sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
            for (var i = 0; i < 9; i++) {
                guidStr += Math.floor(Math.random()*16).toString(16);
            }
            guidStr += sexadecimalDate;
            guidStr += sexadecimalTime;
            while(guidStr.length < 32) {
                guidStr += Math.floor(Math.random()*16).toString(16);
            }
            return this.formatGUID(guidStr);
        }

        /*
         * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
         * 返回值：返回GUID日期格式的字条串
         */
        GUID.prototype.getGUIDDate = function() {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        }

        /*
         * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
         * 返回值：返回GUID日期格式的字条串
         */
        GUID.prototype.getGUIDTime = function() {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero( parseInt(this.date.getMilliseconds() / 10 ));
        }

        /*
         * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
         * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
         * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
         */
        GUID.prototype.addZero = function(num) {
            if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        }

        /* 
         * 功能：将y进制的数值，转换为x进制的数值
         * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
         * 返回值：返回转换后的字符串
         */
        GUID.prototype.hexadecimal = function(num, x, y) {
            if (y != undefined) {
                return parseInt(num.toString(), y).toString(x);
            } else {
                return parseInt(num.toString()).toString(x);
            }
        }

        /*
         * 功能：格式化32位的字符串为GUID模式的字符串
         * 参数：第1个参数表示32位的字符串
         * 返回值：标准GUID格式的字符串
         */
        GUID.prototype.formatGUID = function(guidStr) {
            var str1 = guidStr.slice(0, 8) + '-',
                str2 = guidStr.slice(8, 12) + '-',
                str3 =  guidStr.slice(12, 16) + '-',
                str4 = guidStr.slice(16, 20) + '-',
                str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        }
    }
}

Util.newGuid = function newGuid(){
    return (new GUID()).newGUID();
};

Util.isArray = function isArray(o) {
    return util.isArray(o);
  //return Object.prototype.toString.call(o) === '[object Array]';
} 

Util.isStr = function isStr(str) {
    return util.isString(str);
    //return Object.prototype.toString.call(str) === '[object String]';
}

Util.isNullOrUndefined = function isNullOrUndefined(o) {
    return util.isNullOrUndefined(o);
}

Util.isNumber = function isNumber(o) {
    return util.isNumber(o);
}

Util.isObject = function isObject(o) {
    return util.isObject(o);
}

Util.isMailAddr = function isMailAddr(mail) {
 var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
 if (filter.test(mail)) return true;
 else {
    return false;
    }
}

//过滤某些非法字符
Util.stripscript = function stripscript(s, cutNum) {
    var pattern = new RegExp('[$&_]');
        var rs = '';
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    if (cutNum && cutNum > 0) {
        if (rs.length > cutNum) {
            rs = rs.substr(0, cutNum);
        }
    }
    return rs;
}

Util.isMobile = function isMobile(s) {
    //3可能是亲情号码
    if (s.length != 3 && s.length != 11 && s.length != 12) {
        return false;
    }
    var patrn = /^[+]{0,1}(\d){1,3}[]?([-]?((\d)|[]){1,12})+$/;
    if (!patrn.exec(s)) return false;
    return true;
}

////如果key不为空，则用key对应的Value进行排序，否则直接拿数组值进行排序
//desc为bool值，如为true，表示降序，否则升序
Util.bubbleSort = function bubbleSort(arr, desc, key) {
    if (arr.length <= 1) {
        return arr;
    }
    
    var n = arr.length,
        i = 0,
        temp;
 
    while(--n) {
        while (i < n) {
            var lower = false;
            if (key) {
                if (arr[i][key] == null || arr[i][key] == undefined) {
                    console.log('bubbleSort--can not find key:' + key);
                    return arr;
                } 
                if (arr[i][key] < arr[i+1][key]) {
                    lower = true;
                }
            }
            else {
                if (arr[i] < arr[i + 1]) {
                    lower = true;
                }
            }
            // 如果降序，则lower和desc都为true，如果为升序，则lower和desc都为false
            if (lower === desc) {
                temp = arr[i];
                arr[i] = arr[i+1];
                arr[i+1] = temp;
            }
            i++;
        }
        // 每次冒泡完成后，将i复位
        i = 0;
    }
    return arr;
}

Util.transDevice2App = function transDevice2App(data) {
    var retBuf = new Buffer(data.length);
    var retIndex = 0;
    for (var i = 0; i < data.length; i++, retIndex++) {
        if (data[i] == 0X7D) {
            switch (data[++i]) {
                case 0X01: 
                    retBuf[retIndex] = 0X7D;
                    break;
                case 0X02: 
                    retBuf[retIndex] = 0X5B;
                    break;
                case 0X03: 
                    retBuf[retIndex] = 0X5D;
                    break;
                case 0X04: 
                    retBuf[retIndex] = 0X2C;
                    break;
                case 0X05: 
                    retBuf[retIndex] = 0X2A;
                    break;
                default:
                    retBuf[retIndex] = data[i--];
                    break;
            }
        }
        else {
            retBuf[retIndex] = data[i];
        }
    }
    retBuf = retBuf.slice(0, retIndex);
    return retBuf;
}

Util.transApp2Device = function transApp2Device(data) {
    var retBuf = new Buffer(data.length + 1000);//预留一千个字节供特殊字符转义
    var retIndex = 0;
    for (var i = 0; i < data.length; i++, retIndex++) {
        switch (data[i]) {
            case 0X7D: 
                retBuf[retIndex] = 0X7D;
                retBuf[++retIndex] = 0X01;
                break;
            case 0X5B: 
                retBuf[retIndex] = 0X7D;
                retBuf[++retIndex] = 0X02;
                break;
            case 0X5D: 
                retBuf[retIndex] = 0X7D;
                retBuf[++retIndex] = 0X03;
                break;
            case 0X2C: 
                retBuf[retIndex] = 0X7D;
                retBuf[++retIndex] = 0X04;
                break;
            case 0X2A: 
                retBuf[retIndex] = 0X7D;
                retBuf[++retIndex] = 0X05;
                break;
            default:
                retBuf[retIndex] = data[i];
                break;
        }
    }
    retBuf = retBuf.slice(0, retIndex);
    return retBuf;
}

Util.tounicode = function tounicode(str) {
    if (!str) return '';
    var temp, i = 0, r = '', len = str.length;
    for (; i < len; i++) {
        temp = str.charCodeAt(i).toString(16).toUpperCase();
        while (temp.length < 4) {
            temp = '0' + temp;
        }
        r += temp;
    }
    return r;
}

Util.toutf8 = function toutf8(unicode) {
    var uchar;    
    var utf8str = "";    
    var i;    
    for (i = 0; i < unicode.length; i += 4) {           
        uchar = parseInt(unicode[i] + unicode[i+1] + unicode[i+2] + unicode[i+3],16);            
        utf8str = utf8str + String.fromCharCode(uchar);     
    }    
    return utf8str;    
}
//console.log(Util.tounicode('180916,025723,22.570733,113.8626083,50,广东省,广州市,天河区,望星楼,00200010'));
//console.log(Util.toutf8('003100380030003900310036002C003000320035003700320033002C00320032002E003500370030003700330033002C003100310033002E0038003600320036003000380033002C00350030002C5E7F4E1C7701002C5E7F5DDE5E02002C59296CB3533A002C671B661F697C'));
Util.toascii = function toascii(data) {
    return data;
    if (!data) return '';
    var str = '';
    for (var i = 0; i < data.length; i ++) {
        str += data.charAt(i).charCodeAt();
    }
    return str;
}

var iconv = require('iconv-lite');
Util.encodeToGb2312 = function encodeToGb2312(str){
    var gb2312 = iconv.encode(str, 'GB2312');
    var gb2312Hex = gb2312.toString('hex');
    return gb2312Hex;
}

var HttpUtil = require('./httpUtil.js');
Util.getShortUrl = function getShortUrl(url, callback) {
    var routeObj = {};
    routeObj.route_path = '/short_url/shorten.json?source=3271760578&url_long=' + url;
    routeObj.route_ip = 'api.t.sina.com.cn';
    routeObj.route_port = 80;
    routeObj.route_method = 'get';
    routeObj.msg_data = {};

    HttpUtil.httpRequest(routeObj, function(err, data) { 
        if (data) {
            try {
                var obj = JSON.parse(data);
                if (obj && obj[0].url_short) {
                    //console.log(obj[0].url_short);
                    return callback(obj[0].url_short);
                }
                else {
                    return callback(null);
                }
            }
            catch (e) {
                console.log(e);
                return callback(null);
            }
        }
        else {
            return callback(null);
        }
    });
}

var crypto = require('crypto');//
Util.getMd5 = function getMd5(src) {
    var md5 = crypto.createHash('md5');
    var md5Value = md5.update(src).digest('hex');
    return md5Value;   
}

Util.sendSMS = function sendSMS(sim, content, callback) {
    var routeObj = {};
    var username = 'clywjkj';
    var pwd = 'r4dbxvkj';
    var md5 = crypto.createHash('md5');
    var md5Tmp = md5.update(pwd).digest('hex');
    var md5Final = crypto.createHash('md5');
    var password = md5Final.update(username + md5Tmp).digest('hex');

    routeObj.route_path = '/smsSend.do?username=' + username + '&password=' + password + 
        '&mobile=' + sim + '&content=' + content;
    routeObj.route_ip = 'sms-cly.cn';
    routeObj.route_port = 80;
    routeObj.route_method = 'get';
    routeObj.msg_data = {};

    HttpUtil.httpRequest(routeObj, function(err, data) {
        return callback(err, data);
    });
}


// 模版CODE: SMS_79510008
// 模版内容:云芯科技提醒您：[${Who}]通过守护模式发出求救，位置:${Where}

// 模版CODE:SMS_79485013
// 模版内容:云芯科技提醒您：[${Who}]进入围栏[${What}]，位置：${Where}。

// 模版CODE:SMS_79485014
// 模版内容:云芯科技提醒您：[${Who}]离开围栏[${What}]，位置：${Where}。

// 模版CODE:SMS_79605009 
// 模版内容:云芯科技提醒您：[${Who}] 向您发出求救，地址:${Where} 。
var templateCode = ['SMS_79510008', 'SMS_79485013', 'SMS_79485014', 'SMS_79605009'];
// var SMS = require('aliyun-sms-node');
// var sms = new SMS({
//       AccessKeyId: 'LTAIDlcMQRlOu3qh',
//       AccessKeySecret: 'zhn3DUwmybeMfTm7UFajBagRmi0OtS'
//     });
// Util.sendSMSAli = function sendSMSAli(smsObj, callback) {
//     var sim = smsObj.SIM;
//     var code = smsObj.Code;
//     var params = {'Who':smsObj.Who, 'Where':smsObj.Where};
//     if (code == 1 || code == 2) {
//         params['What'] = smsObj.What;
//     }
//     sms.send({
//       Format: 'JSON',
//       Action: 'SendSms',
//       TemplateParam: JSON.stringify(params),
//       PhoneNumbers: sim,
//       SignName: '云芯科技',
//       TemplateCode: templateCode[code]
//     }).then((result) => {
//       var obj = JSON.parse(result);
//       if (obj && obj.Code) {
//         return callback(obj.Code);
//       }
//       return callback(result);
//     }).catch(err => {
//         return callback(err);
//     });
// }

function getSMSContent(smsObj) {
    var code = smsObj.Code;
    var content = "";
    if (code == 1) {
        content = "[" + smsObj.Who + "]进入围栏[" + smsObj.What + "]，位置：" + smsObj.Where;
    }
    else if (code == 2) {
        content = "[" + smsObj.Who + "]离开围栏[" + smsObj.What + "]，位置：" + smsObj.Where;    
    }
    else if (code == 3) {
        content = "[" + smsObj.Who + "]向您发出求救，位置：" + smsObj.Where;
    }
    else {
        content = "[" + smsObj.Who + "]通过守护模式发出求救，位置：" + smsObj.Where;
    }
    //return '云芯';
    return content;
}

function sendFromMC(content, sim, callback) {
    var routeObj = {};
    routeObj.route_path = '/sms3_api/jsonapi/jsonrpc2.jsp';
    routeObj.route_ip = '112.74.139.4';
    routeObj.route_port = 8002;
    routeObj.route_method = 'post';
    routeObj.msg_data = {"id": 1 ,
        "method":"send",
        "params":{
            "userid":"202486",
            "password":"1c52e888cefefcec4e34a612ea8c1398",
            "submit": [{
                "content":content,
                "phone":sim}]
        }
    };
    routeObj.content_type = 'urlbody';
    //console.log(JSON.stringify(routeObj.msg_data));
    // routeObj.msg_data = routeObj.msg_data;
    HttpUtil.httpRequest(routeObj, function(err, data) {
        //console.log(data);
        return callback(err, data);
    });    
}

Util.sendSMSMC = function sendSMSMC(smsObj, callback) {
    sendFromMC(getSMSContent(smsObj) + '【云芯科技】', smsObj.SIM, function(err, data) {
        return callback(data);
    });
}

Util.sendSMSMC2 = function sendSMSMC2(content, sim, callback) {
    sendFromMC(content, sim, function(err, data) {
        return callback(err, data);
    });    
}


// sendSMS('13662313580', '[Vincent]通过守护模式向您发出求救,位置http://t.cn/RK1Mb6x', function(err, data) {
//     console.log(data);
// })
//getShortUrl('http://api.xcloudtech.com/posid906b67590ad4f69a4414322b');

// function sendSMSObj() {
//     var obj = {"Time" : "2017-07-27 15:54:38", "Who" : "Vincent", "Where" : "t.cn/RK1Mb6x【云芯科技】", "SIM" : "13662313580", "UID" : "577a05e0e016a4ae3b9be86b", "Code" : 0, "T" : "isv.TEMPLATE_PARAMS_ILLEGAL" };
//     Util.sendSMSMC(obj, function(data) {console.log(data)});
// }
// setTimeout(sendSMSObj, 1000);

module.exports = Util;