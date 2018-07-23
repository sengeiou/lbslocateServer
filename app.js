var express = require('express');
var fs = require('fs');
//var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});
var path = require('path');
//var favicon = require('static-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Settings = require('./settings');
var log = require('./log');
var PosUtil = require('./util/posUtil.js');
var Output = require('./routes/v3output.js');


var app = express();
log.use(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(logger('combined',{stream: accessLogfile}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//cookie解析的中间件
app.use(cookieParser());
//静态网页开关
app.use(express.static(path.join(__dirname, 'public')));
//app.use(flash());

app.use(function(req, res, next){
	//console.log("app.usr local");
	res.locals.user = req.session.user;
	/*res.locals.post = req.session.post;
	var error = req.flash('error');
	res.locals.error = error.length ? error : null;

	var success = req.flash('success');
	res.locals.success = success.length ? success : null;*/
	next();
});

// app.use(function(req, res, next) {
//     req.socket.on("error", function() {
//         console.log('req error,headers:' + JSON.stringify(req.headers) + ',desc:' + req.method + ' ' + req.url);
//     });
//     res.socket.on("error", function() {
//         console.log('res error,headers:' + JSON.stringify(req.headers) + ',desc:' + req.method + ' ' + req.url);
//     });
//     next();
// });

var https = require('https');
// var privateKey = fs.readFileSync('sslcert/privatekey.pem', 'utf8');
// var cretificate = fs.readFileSync('sslcert/certificate.pem', 'utf8');
var privateKey = fs.readFileSync('sslcert/2_xcloudtech.com.key', 'utf8');
var cretificate = fs.readFileSync('sslcert/1_xcloudtech.com_bundle.crt', 'utf8');
var credentials = {key:privateKey, cert:cretificate};

var http = require('http');
if (!module.parent) {
  //https.createServer(credentials, app).listen(443);
  http.createServer(app).listen(8080);
  console.log("Express服务器启动, http:8080端口, 以 %s 模式运行.", app.settings.env);
}

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        var meta = '[' + new Date() + ']' +req.url + '\n';
        errorLogfile.write(meta +err.stack + '\n');
        next();
        res.status(err.status || 500);
        /*res.render('error', {
            message: err.message,
            error: err
        });*/
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    var meta = '[' + new Date() + ']' +req.url + '\n';
    errorLogfile.write(meta +err.stack + '\n');
    next();
    res.status(err.status || 500);
    /*res.render('error', {
        message: err.message,
        error: {}
    });*/
});

var LBSData = require('./models/lbsData.js');
function getGeoPos(mcc, mnc, lbsList, macList, callback) {
    var cellObj = lbsList[0];
    LBSData.getCellAddr(mcc, mnc, cellObj.Lac, cellObj.CellID, function(err, doc) {
        if (doc) {//发现有记录
            if (!doc.FAddr) {//有经纬度，但没有位置，从谷歌抓位置并更新到数据库
                PosUtil.getPosFromGoogle(doc.Lon, doc.Lat, 550, function(err, posObj) {
                    var cellAddr = {FAddr:posObj.FAddr, City:posObj.City, Pro:posObj.Pro, 
                        CY:posObj.CY, Str:posObj.Str, Dist:posObj.Dist, Radius:posObj.Radius}
                    LBSData.updateCellAddr(mcc, mnc, cellObj.Lac, cellObj.CellID, cellAddr, function(err) {
                        return callback(err, posObj);
                    });
                });                    
            }
            else {//有位置，直接返回
                var posObj = {Lon:doc.Lon, Lat:doc.Lat, FAddr:doc.FAddr, City:doc.City, Pro:doc.Pro, 
                    CY:doc.CY, Str:doc.Str, Dist:doc.Dist, Radius:doc.Radius};
                return callback(err, posObj);
            }
        }
        else {//没有记录，直接从谷歌抓取。（此处可判断其是否有权限，如果是3元终身的则不允许进此处，如是交费的可进此处）
            PosUtil.getGeoPosFromGoogle(mcc, mnc, lbsList, macList, function(err, data) {
                if (data) {
                    for (var i = 0; i < lbsList.length; i++) {
                        var cellAddr = {Lac:lbsList[i].Lac, Cell:lbsList[i].CellID, 
                            Lon:data.Lon, Lat:data.Lat, FAddr:data.FAddr, City:data.City, Pro:data.Pro, 
                            CY:data.CY, Str:data.Str, Dist:data.Dist, Radius:data.Radius}
                        LBSData.saveCellAddr(mcc, mnc, cellAddr, function(err) {});                        
                    }
                    return callback(err, data);
                }
                else {
                    return callback('cannot geo pos', null);
                }
            });
        }
    });
}

app.post('/geolocation', function (req, res) {
    console.log(222);
    // PosUtil.getGeoPosFromGoogle(req.body.MCC, req.body.MNC, req.body.LBSList, req.body.MacList, function(err, data) {
    //     console.log(data);
    //     return Output.sendRes({Err:err, Data:data}, req, res);
    // });
    var lbsList = req.body.LBSList;
    var mainLBS = [];
    if (lbsList.length > 0) {
        mainLBS.push(lbsList[0]);
    }
    getGeoPos(req.body.MCC, req.body.MNC, mainLBS, req.body.MacList, function(err, data) {
        console.log(data);
        return Output.sendRes({Err:err, Data:data}, req, res);
    });
});

app.get('/geocode', function (req, res) {
    console.log(111);
    PosUtil.getPosFromGoogle(req.query.Lon, req.query.Lat, req.query.Radius, function(err, data) {
        console.log(data);
        return Output.sendRes({Err:err, Data:data}, req, res);
    });
});

app.get('/lbspos', function(req, res) {
    var imei = req.query.IMEI;
    var bts = req.query.BTS;
    var nearbts = req.query.NearBTS;
    if (!bts) {
        return Output.sendRes({Err:'failed:no bts'}, req, res);
    }
    if (!nearbts) {
        nearbts = '';
    }
    var cdma = req.query.CDMA;
    if (Number(cdma) == 1) {
        PosUtil.getCdmaCellPosFromAmap(bts, function(err, data) {
            return Output.sendRes({Err:err, Data:data}, req, res);
        });
    }
    else {
        PosUtil.getMutilCellPosFromAmap(bts, nearbts, function(err, data) {
            return Output.sendRes({Err:err, Data:data}, req, res);
        });
    }
});

module.exports = app;
