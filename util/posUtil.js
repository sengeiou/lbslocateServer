var Settings = require('../settings');
var Util = require('./util.js');
var Citycode = require('./citycode.js');
var HttpUtil = require('./httpUtil.js');
var tcplogger = require('../log').tcpLogger;
function PosUtil() {
};

// WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
// GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
// BD-09：百度坐标偏移标准，Baidu Map使用

// //WGS-84 to GCJ-02
// GPS.gcj_encrypt();

// //GCJ-02 to WGS-84 粗略
// GPS.gcj_decrypt();

// //GCJ-02 to WGS-84 精确(二分极限法)
// // var threshold = 0.000000001; 目前设置的是精确到小数点后9位，这个值越小，越精确，但是javascript中，浮点运算本身就不太精确，九位在GPS里也偏差不大了
// GSP.gcj_decrypt_exact();

// //GCJ-02 to BD-09
// GPS.bd_encrypt();

// //BD-09 to GCJ-02
// GPS.bd_decrypt();

// //求距离
// GPS.distance();

var GOOGLE_KEY = 'AIzaSyCp8yh9FK2j4m9zOuIA37wGvqAig0u6AEQ';
var AMAP_KEY = 'a146829f9068a303c655e5cb05f91b89';//高德web
var AMAP_LOC_KEY = 'b58fb4601839a5af34c2103499e75fa8';//高德网络定位key
var WT_KEY = '4b638573a0194bf585aa8266e1b67644';//和风https://www.heweather.com/documents/api/v5/weather

var GPS = {
    PI : 3.14159265358979324,
    x_pi : 3.14159265358979324 * 3000.0 / 180.0,
    delta : function (lat, lon) {
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },
     
    //WGS-84 to GCJ-02
    gcj_encrypt : function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};
 
        var d = this.delta(wgsLat, wgsLon);
        return {'lat' : Math.round((wgsLat + d.lat)*1000000)/1000000,'lon' : Math.round((wgsLon + d.lon)*1000000)/1000000};
    },
    //GCJ-02 to WGS-84
    gcj_decrypt : function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};
         
        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },
    //GCJ-02 to WGS-84 exactly
    gcj_decrypt_exact : function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;
 
            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;
 
            if (++i > 10000) break;
        }
        //console.log(i);
        return {'lat': wgsLat, 'lon': wgsLon};
    },
    //GCJ-02 to BD-09
    bd_encrypt : function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;  
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);  
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);  
        bdLon = z * Math.cos(theta) + 0.0065;  
        bdLat = z * Math.sin(theta) + 0.006; 
        return {'lat' : bdLat,'lon' : bdLon};
    },
    //BD-09 to GCJ-02
    bd_decrypt : function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;  
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);  
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);  
        var gcjLon = z * Math.cos(theta);  
        var gcjLat = z * Math.sin(theta);
        return {'lat' : gcjLat, 'lon' : gcjLon};
    },
    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt : function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat' : y, 'lon' : x};
    },
    mercator_decrypt : function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat' : y, 'lon' : x};
    },
    // two point's distance
    distance : function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = Math.round(alpha * earthR);
        return distance;
    },
    outOfChina : function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat : function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon : function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};

PosUtil.getWT = function getWT(cityname, callback) {
	var routeObj = {};
	routeObj.route_path = '/v5/now?city=' + cityname + '&key=' + WT_KEY;
	routeObj.route_ip = 'free-api.heweather.com';
	routeObj.route_port = 443;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};

	HttpUtil.httpsRequest(routeObj, function(err, cityinfo) {
		if (!cityinfo) {
			return callback(err, null);
		}
		try {
// {"HeWeather5":[{"basic":{"city":"广州","cnty":"中国","id":"CN101280101","lat":"23.125178","lon":"113.280637","update":{"loc":"2017-04-10 14:51","utc":"2017-04-10 06:51"}},"now":{"cond":{"code":"101","txt":"多云"},"fl":"32","hum":"76","pcpn":"0","pres":"1004","tmp":"28","vis":"7","wind":{"deg":"160","dir":"东南风","sc":"3-4","spd":"13"}},"status":"ok"}]}
			if (cityinfo) {
				var cityobj = JSON.parse(cityinfo);
				if (cityobj && cityobj["HeWeather5"] && cityobj["HeWeather5"].length > 0) {
					var detailInfo = cityobj["HeWeather5"][0];
					if (detailInfo && detailInfo["now"]) {
						var nowDetailInfo = detailInfo["now"];
						if (nowDetailInfo["cond"] && nowDetailInfo["tmp"]) {
							//wtCode,0晴1阴2雨3雪
							var obj = {weather:nowDetailInfo["cond"]["txt"], wtCode:1, temp:nowDetailInfo["tmp"]};
							var code = nowDetailInfo["cond"]["code"];
							if (code < 104) {//参考https://cdn.heweather.com/condition-code.txt
								obj.wtCode = 0;
							}
							if (code > 299 && code < 400) {
								obj.wtCode = 2;
							}
							if (code > 399 && code < 500) {
								obj.wtCode = 3;
							}
							if (nowDetailInfo["wind"]) {
								obj.windTxt = nowDetailInfo["wind"]["dir"];
								obj.windSC = nowDetailInfo["wind"]["sc"];
							}
							return callback(err, obj);
						}
					}
				}
			}
			return callback(err, null);	
		}
		catch (e) {
			console.log('err wt msg:' + e + ',' + cityinfo);
			return callback(err, null);
		}
	});	
}

//获取日期，主要用于历史集合名
function getGeocodeInfo(lon, lat, callback) {
	var routeObj = {};
	var location = lon + ',' + lat;
	//routeObj.route_path = '/v3/geocode/regeo?key=63740313b6063fb04263c39ef6d58d06&s=rsv3&location=' + location;
	routeObj.route_path = '/v3/geocode/regeo?key=' + AMAP_KEY + '&location=' + location;
	routeObj.route_ip = 'restapi.amap.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};

	HttpUtil.httpRequest(routeObj, function(err, data) {
		return callback(err, data);
	});
}

function getArroudInfo(lon, lat, radius, keyWord, callback) {
	var routeObj = {};
	var location = lon + ',' + lat;
	routeObj.route_path = '/v3/place/around?key=' + AMAP_KEY + '&location=' + location + 
		'&radius=' + radius + '&extensions=all&keywords=' + keyWord;
	routeObj.route_ip = 'restapi.amap.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};

	HttpUtil.httpRequest(routeObj, function(err, data) {
		return callback(err, data);
	});	
}


PosUtil.getArroudAddrObj = function getArroudAddrObj(lon, lat, radius, keyword, callback) {
	getArroudInfo(lon, lat, radius, keyword, function(err, data) {
		try {
			var obj = JSON.parse(data);
			if (obj.count > 0) {
				var retObj = {};
				var posInfo = obj.pois[0];
				var locInfo = posInfo.location;
				var addrInfo = posInfo.address;
				var splitIndex = locInfo.indexOf(',');
				retObj.Lon = Number(locInfo.substr(0, splitIndex));
				retObj.Lat = Number(locInfo.substr(locInfo.indexOf(',') + 1, locInfo.length - splitIndex - 1));
				retObj.Addr = addrInfo;
				retObj.Name = posInfo.name;
				retObj.AreaID = posInfo.id;
				retObj.Pro = posInfo.pname;
				retObj.City = posInfo.cityname;
				retObj.Dist = posInfo.adname;
				return callback(err, retObj);
			}
			return callback(err, null);
		}
		catch (e) {
			return callback(e, null);
		}
	});	
}

function getLonLatFromCellID(mcc, mnc, lacValue, cellID, callback) {
	var routeObj = {};
	routeObj.route_path = '/cidInfo.php';
	routeObj.route_ip = 'www.cellid.cn';
	routeObj.route_port = 80;
	routeObj.route_method = 'post';
	routeObj.msg_data = {lac:lacValue, cell_id:cellID};

	HttpUtil.httpRequest(routeObj, function(err, data) {//data为cidMap(22.52894934,114.03178365,'(10173,3933)	22.52894934,114.03178365<br>广东省深圳市福田区滨河大道辅道泰然四路91号')
		try {//经纬度坐标系为WGS84，在中国大陆地区使用，需自行转换为GCJ02或BD09坐标系
			if (err) {
				return callback(err, null);
			}
			var lat = data.substring(data.indexOf('(') + 1, data.indexOf(','));
			var lon = data.substring(data.indexOf(',') + 1, data.indexOf(',\''));
			if (lat != '' && lon != '') {
				var lonlat = GPS.gcj_encrypt(Number(lat), Number(lon));
				PosUtil.getPosInfo(lonlat.lon, lonlat.lat, function(err, data) {
					return callback(err, data);
				});
			}
			else {
				return callback('cellid failed:' + data, null);
			}
		}
		catch (e) {
			return callback('cellid failed:' + data + ',err:' + data, null);
		}
	});	
}

function getLonLatFromCellLoc(mcc, mnc, lacValue, cellID, callback) {
	var routeObj = {};
	routeObj.route_path = '/cell/?mcc=' + mcc + '&mnc=' + mnc + '&lac=' + lacValue + '&ci=' + cellID + '&coord=gcj02&output=json'
	routeObj.route_ip = 'api.cellocation.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};
	HttpUtil.httpRequest(routeObj, function(err, data) {
		try {
			if (err) {
				return callback(err, null);
			}
			var obj = JSON.parse(data);
			var addr = obj.address;
			var retObj = null;
			if (obj.lon != '' && obj.lat != '') {
				//var lonlat = GPS.gcj_encrypt(Number(obj.lat), Number(obj.lon));
				if (addr != '' && addr.indexOf(';') > 0) {
					addr = addr.substr(0, addr.indexOf(';'));
					retObj = Citycode.getProCityDistStrFromAddr(addr);
					retObj.Radius = obj.radius;
					
					retObj.Lon = Number(obj.lon);
					retObj.Lat = Number(obj.lat);
					return callback(null, retObj);
				} 
				else{
					PosUtil.getPosInfo(Number(obj.lon), Number(obj.lat), function(err, data) {
						if (data) {
							data.Radius = obj.radius;
						}
						return callback(err, data);
					});
				}				
			}
			else {
				return callback('get lon_lat of cell failed:' + data, null);
			}
		}
		catch (e) {
			return callback('get lon_lat of cell failed:' + data + ',err:' + e, null);
		}
	});	
}

function getLonLatFromWifiMac(mac, callback) {
	var routeObj = {};
	routeObj.route_path = '/wifi/?mac=' + mac + '&coord=gcj02&output=json'
	routeObj.route_ip = 'api.cellocation.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};

	HttpUtil.httpRequest(routeObj, function(err, data) {
		try {
			if (err) {
				return callback(err, null);
			}
			var obj = JSON.parse(data);
			var addr = obj.address;
			var retObj = null;
			if (obj.lon != '' && obj.lat != '') {
				PosUtil.getPosInfo(Number(obj.lon), Number(obj.lat), function(err, data) {
					if (data) {
						data.Radius = Number(obj.radius);
					}
					return callback(err, data);
				});		
			}
			else {
				return callback('get lon_lat of cell failed:' + data, null);
			}
		}
		catch (e) {
			return callback('get lon_lat of cell failed:' + data + ',err:' + e, null);
		}
	});	
}

function getPosFromAmap(routeObj, callback) {
	HttpUtil.httpRequest(routeObj, function(err, data) {
		try {
			if (err || !data) {
				return callback(err, null);
			}
			//console.log(data);
			var obj = JSON.parse(data);
			if (!obj || !obj.result || !obj.result.desc) {
				return callback('error msg from ' + JSON.stringify(routeObj), null);
			}
			var posObj = obj.result;
			var addr = posObj.desc;
			var lonlat = posObj.location;
			var lon = lonlat.substr(0, lonlat.indexOf(','));
			var lat = lonlat.substr(lonlat.indexOf(',') + 1);
			var addrList = addr.split(' ');
			if (addrList.length < 4) {
				PosUtil.getPosInfo(Number(lon), Number(lat), function(err, data) {
					if (data) {
						data.Radius = Number(posObj.radius);
					}
					return callback(err, data);
				});				
			}
			else {
				var pos = {Lon:Number(lon), Lat:Number(lat), Radius:Number(posObj.radius), 
					CT:Util.getStrDate(), UT:Util.getStrDate(),
					Pro:addrList[0], City:addrList[1], Dist:addrList[2], Str:addrList[3]};
				if (addrList.length == 5) {
					pos.Str += addrList[4];
				}
				return callback(null, pos);
			}
		}
		catch (e) {
			return callback('get lon_lat of cell failed:' + data + ',err:' + e, null);
		}
	});	
}

function getCellPosFromAmap(mcc, mnc, lacValue, cellID, callback) {
	var routeObj = {};
	routeObj.route_path = '/position?accesstype=0&imei=352315052834187&cdma=0&bts=' + mcc + ',' + mnc + ',' + lacValue + ',' + cellID + ',-80&output=json&key=' + AMAP_LOC_KEY;
	routeObj.route_ip = 'apilocate.amap.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};

	getPosFromAmap(routeObj, function(err, data) {
		return callback(err, data);
	});
}

// getCellPosFromAmap(460, 0, 9473,12993, function(err, data) {
// 	PosUtil.getMutilCellPosFromAmap('460,0,13939,30173,-72', '460,0,13939,44793,-81|460,0,13939,30174,-87|460,0,13939,25202,-91|460,0,13939,62713,-93|460,0,13939,30172,-95|460,0,13939,12512,-96', function(err, data){});
// });

PosUtil.getMutilCellPosFromAmap = function getMutilCellPosFromAmap(bts, nearby, callback) {
	var routeObj = {};
	routeObj.route_path = '/position?accesstype=0&imei=352315052834187&cdma=0&bts=' +bts + '&nearbts=' + nearby + '&output=json&key=' + AMAP_LOC_KEY;
	routeObj.route_ip = 'apilocate.amap.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};

	getPosFromAmap(routeObj, function(err, data) {
		return callback(err, data);
	});
}

PosUtil.getCdmaCellPosFromAmap = function getCdmaCellPosFromAmap(bts, callback) {
	var routeObj = {};
	routeObj.route_path = '/position?accesstype=0&imei=352315052834187&cdma=1&bts=' +bts + '&output=json&key=' + AMAP_LOC_KEY;
	routeObj.route_ip = 'apilocate.amap.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};
	getPosFromAmap(routeObj, function(err, data) {
		return callback(err, data);
	});
}

PosUtil.getForeignPosFromLBSMac = function getForeignPosFromLBSMac(mcc, mnc, lbsList, macList, callback) {
	var routeObj = {};
	routeObj.route_path = '/geolocation';
	routeObj.route_ip = '103.218.243.123';
	routeObj.route_port = 8080;
	routeObj.route_method = 'post';
	routeObj.content_type = 'application/json';
	routeObj.msg_data = {MCC:mcc, MNC:mnc, LBSList:lbsList, MacList:macList};
	HttpUtil.httpRequest(routeObj, function(err, data) {
		try {
			var obj = JSON.parse(data);
			if (obj.FAddr) {
				obj.Lon = Number(obj.Lon);
				obj.Lat = Number(obj.Lat);
				obj.Radius = Number(obj.Radius);
				return callback(err, obj);
			}
			return callback(err, null);
		}
		catch (e) {
			return callback(e, null);
		}
	});	
}

PosUtil.geocodeForeignPos = function geocodeForeignPos(lon, lat, radius, callback) {
// function geocodeForeignPos(lon, lat, radius, callback) {
	var routeObj = {};
	routeObj.route_path = '/geocode?Lon=' + lon + '&Lat=' + lat + '&Radius=' + radius;
	routeObj.route_ip = '103.218.243.123';
	routeObj.route_port = 8080;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};
	HttpUtil.httpRequest(routeObj, function(err, data) {
		try {
			var obj = JSON.parse(data);
			if (obj.FAddr) {
				obj.Lon = lon;
				obj.Lat = lat;
				obj.Radius = radius;
				return callback(err, obj);
			}
			return callback(err, null);
		}
		catch (e) {
			return callback(e, null);
		}
	});	
}

PosUtil.getPosFromGoogle = function getPosFromGoogle(lon, lat, radius, callback) {
	var routeObj = {};
	// routeObj.route_path = '/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=AIzaSyCp8yh9FK2j4m9zOuIA37wGvqAig0u6AEQ'
	routeObj.route_path = '/maps/api/geocode/json?latlng=' + lat + ',' + lon;
	routeObj.route_ip = 'maps.googleapis.com';
	routeObj.route_port = 443;
	routeObj.route_method = 'post';
	routeObj.content_type = 'application/json';
	routeObj.msg_data = {};
	HttpUtil.httpsRequest(routeObj, function(err, data) {
        try {
            var rootObj = JSON.parse(data);
            var results = rootObj.results[0];
            var array = results.address_components;
            var posObj = {Lon:lon, Lat:lat, FAddr:results.formatted_address, City:'', Pro:'', CY:'', Str:'', Dist:'', Radius:radius};
            var strNumber = '', strRoute = '';
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                var type = obj.types;//.optString("types");
                var longName = obj.long_name;
                if (type.indexOf("street_number") != -1) {
                    strNumber = longName;
                } else if (type.indexOf("route") != -1) {
                    strRoute = longName;
                } else if (type.indexOf("sublocality") != -1) {
                    posObj.Dist = longName;
                } else if (type.indexOf("locality") != -1) {
                    posObj.City = longName;
                } else if (type.indexOf("administrative_area_level_1") != -1) {
                    posObj.Pro = longName;
                } else if (type.indexOf("country") != -1) {
                    posObj.CY = longName;
            	}
            }
            posObj.Str = strNumber + ' ' + strRoute;
            return callback(err, posObj);
        } catch (e) {
            return callback(e, null);
        }
	});	
}

//lbsList格式为{Lac:lac,CellID:cellID,S:signal}
PosUtil.getGeoPosFromGoogle = function getGeoPosFromGoogle(mnc, mcc, lbsList, macList, callback) {
// function getGeoPosFromGoogle(mnc, mcc, lbsList, macList, callback) {
	var routeObj = {};
	routeObj.route_path = '/geolocation/v1/geolocate?key=' + GOOGLE_KEY;
	routeObj.route_ip = 'www.googleapis.com';
	routeObj.route_port = 443;
	routeObj.route_method = 'post';
	routeObj.content_type = 'application/json';
	var cellList = [];
	for (var i = 0; i < lbsList.length; i++) {//
		cellList.push({"cellId": lbsList[i].CellID,
		      "locationAreaCode": lbsList[i].Lac,
		      "mobileCountryCode": mcc,
		      "mobileNetworkCode": mnc,
		      //"age": 0,
		      "signalStrength": lbsList[i].S
		      //"timingAdvance": 15
		  	});
	}
	var macList = [];
	for (var i = 0; i < macList.length; i++) {
		macList.push({macAddress:macList[i].Mac, signalStrength:macList[i].S});//  "age": 0,"channel": 11,"signalToNoiseRatio": 0
	}
	routeObj.msg_data = {
		  "cellTowers": cellList,
		  "wifiAccessPoints": macList
		};
	HttpUtil.httpsRequest(routeObj, function(err, data) {
		if (err || !data) {
			console.log('error');
			return callback(err, null);
		}
		var obj = JSON.parse(data);
		if (obj && obj.location && obj.location.lat && obj.location.lng) {
			PosUtil.getPosFromGoogle(obj.location.lng, obj.location.lat, obj.accuracy, function(err, posObj) {
				return callback(err, posObj);
			});
		}
		else {
			return callback(err, null);
		}
	});	
}

// var lbs = [{Lac:55180,CellID:7063,S:-99}, {Lac:55180,CellID:7062,S:-102}, {Lac:55180,CellID:7064,S:-102}];
// var wifi = []; 
// //国外基站数据
// getGeoPosFromGoogle(250,99, lbs, wifi, function(err, data) {
// 	console.log(11);
// 	console.log(data);
// });

function getMacPosFromAmap(macInfo, callback) {
	var routeObj = {};
	routeObj.route_path = '/position?accesstype=1&imei=352315052834187&macs=' + macInfo + '&output=json&key=' + AMAP_LOC_KEY;
	routeObj.route_ip = 'apilocate.amap.com';
	routeObj.route_port = 80;
	routeObj.route_method = 'get';
	routeObj.msg_data = {};
	getPosFromAmap(routeObj, function(err, data) {
		return callback(err, data);
	});
}

PosUtil.gcjEncrypt = function gcjEncrypt(lon, lat) {
	var lonlat = GPS.gcj_encrypt(Number(lat), Number(lon));
	return lonlat;
} 

PosUtil.getAddrOfOneCell = function getAddrOfOneCell(mcc, mnc, lacValue, cellID, callback) {
	getCellPosFromAmap(mcc, mnc, lacValue, cellID, function(err, data) {
		if (data) {
			return callback(err, data);
		}

		getLonLatFromCellLoc(mcc, mnc, lacValue, cellID, function(err, data) {
			if (data) {
				return callback(err, data);
			}
			else {
				getLonLatFromCellID(mcc, mnc, lacValue, cellID, function(err, data) {
					if (data) {
						data.Radius = 500;//此平台没有覆盖范围之说，默认为500
					}
					return callback(err, data);
				});
			}
		});
	});
}

PosUtil.getAddrOfMacInfo = function getAddrOfMacInfo(macInfo, callback) {
	if (macInfo.indexOf('|') > 0) {
		getMacPosFromAmap(macInfo, function(err, data) {
			return callback(err, data);
		});		
	}
	else {
		getLonLatFromWifiMac(macInfo, function(err, data) {
			return callback(err, data);
		});			
	}
}

PosUtil.getAddrOfWifi = function getAddrOfWifi(mac, callback) {
	getLonLatFromWifiMac(mac, function(err, data) {
		return callback(err, data);
	});	
}

PosUtil.getPosInfo = function getPosInfo(lon, lat, callback) {
	getGeocodeInfo(lon, lat, function(err, data) {
		if (err) {
			return callback(err, null);
		}
		try {
			var obj = JSON.parse(data);
			if (!obj.regeocode) {
				return callback('regeocode is null:' + data, null);
			}
			var addr = obj.regeocode.formatted_address;
			var addObj = obj.regeocode.addressComponent;
			if (!addr || !addObj) {
				return callback('addr or addrObj is null:' + data, null);
			}
			var pro = addObj.province;
			if (Util.isArray(pro) && pro.length == 0) {
				pro = '';
			}
			var city = addObj.city;
			if (Util.isArray(city) && city.length == 0) {
				city = '';
			}
			var dist = addObj.district;
			if (Util.isArray(dist) && dist.length == 0) {
				dist = '';
			}
			var tmp = city + dist;
			var streetInfo = addr.substring(addr.indexOf(tmp) + tmp.length, addr.length);
			if (city == '' && pro != '') {
				city = pro;
			}
			var pos = {Lon:Number(lon), Lat:Number(lat), Radius:500, 
				CT:Util.getStrDate(), UT:Util.getStrDate(),
				Pro:pro, City:city, Dist:dist, Str:streetInfo};

			return callback(null, pos);
		}
		catch (e) {
			return callback(e, null);	
		}
	});
}

PosUtil.getDistance = function getDistance(lat1, lng1, lat2, lng2){
	return GPS.distance(lat1, lng1, lat2, lng2);
};

//返回true表示跳出围栏了，返回false表示在围栏内
PosUtil.outOfFence = function outOfFence(lat1, lng1, lat2, lng2, radius){    
    var distance = GPS.distance(lat1, lng1, lat2, lng2);
    if (distance < 0) {
        distance = 0 - distance;
    }

    if (distance > radius) {
        return Settings.ACTION_OUT;
    }
    return Settings.ACTION_IN;
};

function getPosByTwoCell(lon1, lat1, s1, lon2, lat2, s2) {
	var lon = 0, lat = 0;
	var rate = s1 / (s1 + s2);
	if (lon1 > lon2) {
		lon = lon2 + (lon1 - lon2) * rate; 
	}
	else {
		lon = lon1 + (lon2 - lon1) * (1 - rate);
	}

	if (lat1 > lat2) {
		lat = lat2 + (lat1 - lat2) * rate; 
	}
	else {
		lat = lat1 + (lat2 - lat1) * (1 - rate);
	}
	//console.log(lon + ',' + lat);
	return {Lon:Math.round(lon * 1000000) / 1000000, Lat:Math.round(lat * 1000000) / 1000000};
}

function getPosByThreeCell(lbsFinalList) {
	if (lbsFinalList.length < 3) {
		return null;
	}
	var lon1 = Number(lbsFinalList[0].Lon), lat1 = Number(lbsFinalList[0].Lat), s1 = lbsFinalList[0].S, 
		lon2 = Number(lbsFinalList[1].Lon), lat2 = Number(lbsFinalList[1].Lat), s2 = lbsFinalList[1].S,
		lon3 = Number(lbsFinalList[1].Lon), lat3 = Number(lbsFinalList[1].Lat), s3 = lbsFinalList[1].S;
	var retLonLat1 = getPosByTwoCell(lon1, lat1, s1, lon2, lat2, s2);
	var retLonLat2 = getPosByTwoCell(lon1, lat1, s1, lon3, lat3, s3);
	var retLonLat3 = getPosByTwoCell(lon2, lat2, s2, lon3, lat3, s3);

	var lon = (retLonLat1.Lon + retLonLat2.Lon + retLonLat3.Lon) / 3, 
		lat = (retLonLat1.Lat + retLonLat2.Lat + retLonLat3.Lat) / 3;
	return {Lon:Math.round(lon * 1000000) / 1000000, Lat:Math.round(lat * 1000000) / 1000000};
}

var MAX_CELL_DIS = 5000;
var MAX_SIGNAL = 110;//最大信号强度值，即原始信号强度值趋近于0
var STANDARD_STRONG = 150;//精准度最高标准值
var STANDARD_LOW = 300;//精准度最低标准值
var SIGNAL_STRONG = 50;//信号强度是由原始信号值加上110得到的，故一般为正值
function getFinalCalCellList(cellAddrList) {
    cellAddrList = Util.bubbleSort(cellAddrList, true, 'S');//对key为S做降序排序
    var lbsFinalList = [];
    for (var i = 0; i < cellAddrList.length; i++) {
        if (lbsFinalList.length >= 3) {
            break;
        }
    	var cell1 = cellAddrList[i];
    	var deviate = 0;//表示与其偏离超过3公里的基站个数
    	for (var j = 0; j < cellAddrList.length; j++) {
    		if (i == j) {
    			continue;
    		}
    		var cell2 = cellAddrList[j];

    		var distance = GPS.distance(cell1.Lat, cell1.Lon, cell2.Lat, cell2.Lon);
    		if (distance > MAX_CELL_DIS) {
    			deviate++;
    			tcplogger.error('two_cell_deviate:' + Math.round(distance) + ',cell1:' + JSON.stringify(cell1) + ',cell2:' + JSON.stringify(cell2));
    		}
    	}
    	if (cellAddrList.length > 2 && deviate == cellAddrList.length - 1) {//如果跟其他所有点都偏离超过3公里，则该点不用来做最终计算
    		continue;
    	}
    	else {
	        lbsFinalList.push(cellAddrList[i]);
	        if (cellAddrList[i].S > SIGNAL_STRONG) {//如果发现有一个基站的信号强度大于60，则直接取该基站即可
	            break;
	        }      		
    	}
    }
    return lbsFinalList;
}

PosUtil.getPos = function getPos(cellAddrList, callback) {
	var lbsFinalList = getFinalCalCellList(cellAddrList);
	if (lbsFinalList == null || lbsFinalList.length == 0) {
		return callback(null);
	}
	var posObj = {};
	var radius = 1000;//默认精准度为1000米
	var len = lbsFinalList.length;
	if (len == 1) {//只有一个点
		var cellObj = lbsFinalList[0];
		if (cellObj.S >= SIGNAL_STRONG) {//如果信号强度大于50，精准度计算为   150 * (（110-信号强度） / 50)
			radius = STANDARD_STRONG * ((MAX_SIGNAL - cellObj.S) / SIGNAL_STRONG);

		}
		else if (cellObj.S > 0){
			radius = STANDARD_LOW * ((MAX_SIGNAL - cellObj.S) / SIGNAL_STRONG);
		}
		posObj = {Lon:cellObj.Lon, Lat:cellObj.Lat, Radius:Math.round(radius), Pro:cellObj.Pro, 
			City:cellObj.City, Dist:cellObj.Dist, Str:cellObj.Str};
		return callback(posObj);
	}
	else {
		var radius = 200;//三点定位精准度
		var retLonLat = null;
		if (len == 2) {//有两个点，对这两个点通过信号强度比例，算出这两个点中间的某个值
			retLonLat = getPosByTwoCell(Number(lbsFinalList[0].Lon), Number(lbsFinalList[0].Lat), lbsFinalList[0].S, 
				Number(lbsFinalList[1].Lon), Number(lbsFinalList[1].Lat), lbsFinalList[1].S);
			radius = 250;//两点定位精准度
		}
		else {//三个点，每两个点做比例计算出一个点，最后得出三个点再做重心计算
			retLonLat = getPosByThreeCell(lbsFinalList);				
		}
		if (retLonLat != null && retLonLat.Lon != null) {//算出最终点，对其做反地理编码解析
	        PosUtil.getPosInfo(retLonLat.Lon, retLonLat.Lat, function(err, posObj) {
	            if (posObj) {
	                posObj.Radius = radius;
	                return callback(posObj);
	            }
	            else {
	                return callback(null);
	            }
	        });			
		}
		else {
			return callback(null);
		}
	}
}

PosUtil.isValidLonLat = function isValidLonLat(lon, lat) {
	if (GPS.outOfChina(Number(lat), Number(lon)) == true) {
		return false;
	} 
	return true;
}

module.exports = PosUtil;