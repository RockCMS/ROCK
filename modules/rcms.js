// RockCMS Module
module.exports = function () {
  var mysql = require('mysql');
  var amqp = require('amqplib/callback_api');
  var settings = {};
  var showLog = false;
  var dbCon;
  //console.log("Module Start");
  //console.log(settings);

  return {
    config: function (config) {
      settings = config;
      dbCon = mysql.createConnection(settings.db_settings);
      dbCon.connect(function(err) {
        if (err) throw err;
        if (showLog) console.log("Database Connected!");
      });
    },
    getData: function (query, callback) {
      var dbData;
      dbCon.query(query, function (err, result) {
        if (err) throw err;
        //console.log(result);
        if (callback && typeof(callback) == "function") return callback(result);
        return result;
      });
      //return dbData;
    },
    fetchObj: function (query, callback) {
      var dbData;
      dbCon.query(query, function (err, result) {
        if (err) throw err;
        let rowObj = {};
        Object.keys(result).forEach(key => {
          rowObj[key] = result[key];
        });
        if (callback && typeof(callback) == "function") return callback(rowObj[0]);
        return result;
      });
      //return dbData;
    },
    getNodeDetails: function (nid) {
        return new Promise(function(resolve, reject){
          dbCon.query(
              `SELECT * FROM contents WHERE nid = '${nid}'`,
              function(err, rows){
                  if(rows === undefined){
                      reject(new Error("Error rows is undefined"));
                  }else{
                    let rowObj = {};
                    Object.keys(rows).forEach(key => {
                      rowObj[key] = rows[key];
                    });
                    resolve(rowObj[0]);
                  }
              }
          )}
      );
    },
    getLockedList: function (currentUID) {
        return new Promise(function(resolve, reject){
          let UIDQuery = (currentUID) ? ` AND locked_by != '${currentUID}'` : '';
          dbCon.query(
              `SELECT nid, locked_by FROM contents WHERE locked = '1' ${UIDQuery}`,
              function(err, rows){
                  if(rows === undefined){
                      reject(new Error("Error rows is undefined"));
                  }else{
                    let rowObj = {};
                    Object.keys(rows).forEach(key => {
                      Object.keys(rows[key]).forEach(keySub => {
                        rowObj[rows[key].nid] = rows[key][keySub];
                      })
                    });
                    resolve(rowObj);
                  }
              }
          )}
      );
    },
    update: function (query) {
        return new Promise(function(resolve, reject){
          dbCon.query(query, function(err, rows){
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              } else {
                resolve(rows);
              }
            }
          )}
      );
    },
    displayData: function (query, res, callback) {
      result = this.getData(query, callback);
      res.send(getData(query, callback));
      return;
    },
    SendMSG: function (jsonData, callback) {
      amqp.connect(settings.rabbit_prod, function(err, conn) {
        conn.createChannel(function(err, ch) {
          var q = 'msgs';
          var msg = JSON.stringify(jsonData);
          ch.assertQueue(q, {durable: true});
          ch.sendToQueue(q, new Buffer(msg));
          var ok = ch.assertExchange(settings.rabbit_exchange, 'fanout', {durable: true});
          ch.publish(settings.rabbit_exchange, 'live', Buffer.from(msg));
          if (callback && typeof(callback) == "function") return callback(ch);
          //console.log(" [x] Sent '%s'", msg);
        });
        //setTimeout(function() { conn.close(); process.exit(0) }, 500);
      });
    },
    totalCount: function () {
      if (showLog) console.log("Get Total Record Length");

    }
  };
}
