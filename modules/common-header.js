//require("../../modules/common-header.js");
console.log("Current Directory: " + __dirname);

console.log("HELLOOO");

  const config = require('../config');
  var rcms = require("../modules/rcms.js");
  var sqlc = new rcms();
  sqlc.config(config);
  const rcmslib = require("../modules/library.js");
  rcmsLib = new rcmslib();



