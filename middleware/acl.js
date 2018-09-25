// RockCMS Module

var config = require('../config');
var rcms = require("../modules/rcms.js");
const mysql = require('mysql');
var sqlc = new rcms();
const _ = require('underscore');
sqlc.config(config);

module.exports = async (req, res, next) => {
  settings = config;
  dbCon = await mysql.createConnection(settings.db_settings);
  await dbCon.connect(function (err) {
    if (err) throw err;
  });
  try {
    if (typeof req.session.userData != 'undefined') {
      await dbCon.query(`SELECT * FROM users WHERE uid = '${req.session.userData.uid}'`, function (err, result) {
        Object.keys(result).forEach(function (key) {
          res.userData = result[key];
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
 next();
}












































/*

// RockCMS Module
var RCMS = (function () {
  var mysql = require('mysql');
  var settings = {};
  var showLog = true;
  var dbCon;
  console.log("Module Start");
  console.log(settings);

  return {
    config: function (settings) {
      console.log(settings);
      dbCon = mysql.createConnection(settings);
      dbCon.connect(function(err) {
        if (err) throw err;
        if (this.showLog) console.log("Database Connected!");
      });
    },
    getData: function (query) {
      dbCon.query(query, function (err, result) {
        if (err) throw err;
        if (showLog) console.log(result);
        return result;
      });
      //console.log("Hey There Man .... " + name);
    },
    totalCount: function () {
      if (showLog) console.log("Get outta here...");

    }
  };
})();





var settings = {
    host: "localhost",
    user: "bdp_bdpage",
    password: "eastcedar",
    database: "newscms"
  }

var sqlc = RCMS;
sqlc.config(settings);
// call module + methods
sqlc.getData("SELECT nid,title FROM node ORDER BY nid DESC LIMIT 1");

sqlc.getData("SELECT title,nid FROM node ORDER BY nid ASC LIMIT 1");

sqlc.totalCount();

*/
