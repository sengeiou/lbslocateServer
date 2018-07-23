var settings = require('../settings.js');
var Db = require('mongodb').Db,
    Server = require('mongodb').Server;
var androidPusher = require('./androidPusher.js');
var iosPusher = require('./iosPusher.js');
var db = require('../models/db');
var SessionManager = require('../models/sessionManager.js')

function dispatchMsg() {
  console.log('start dispatchMsg');
  db.collection(settings.COLLECTION_Msg, function(err, collection) {
    collection.find({FID:'13420540354'}, {FID:1}).sort({Time:1}).toArray(function(err, docs) {
      var mapID = {};
      docs.forEach(function(doc) {
        mapID[doc.FID] = true;
      });

      var listID = [];
      for(var key in mapID){ 
        listID.push(key);
      };

      listID.forEach(function(ID) {
        SessionManager.getPushID(ID, function(err, pushInfo) {
          if (pushInfo) {
            var msgContent = '0';
            if (pushInfo.D == '0') {
              androidPusher.pushMsg(pushInfo.PushID, msgContent); 
              console.log('[android]pushMsg to ' + ID);
            }
            else {
              iosPusher.pushMsg(pushInfo.PushID, msgContent); 
              console.log('[ios]pushMsg to ' + ID);
            }
          }
          else {
            console.log('ID[' + ID + '] donot have pushID');
          }
        });        
      })
    });     
  });
};


setInterval(dispatchMsg, 1000 * 10);

