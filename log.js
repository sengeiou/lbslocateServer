var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",
            filename: 'logs/log.log',
            pattern: "_yyyy-MM-dd",
			maxLogSize: 80960,
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        },
        {
            type: "dateFile",
            filename: 'logs/tcplog.log',
            pattern: "_yyyy-MM-dd",
            maxLogSize: 80960,
            alwaysIncludePattern: false,
            category: 'tcpServer'
        }//日期文件格式//日期文件格式
    ],
    replaceConsole: true,   //替换console.log
    levels:{
        dateFileLog: 'DEBUG',
        tcpServer:'DEBUG',
    }
});

var dateFileLog = log4js.getLogger('dateFileLog');
var tcpFile = log4js.getLogger('tcpServer');

exports.logger = dateFileLog;

exports.tcpLogger = tcpFile;

exports.use = function(app) {
    //页面请求日志,用auto的话,默认级别是WARN
    //app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
    app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
}
