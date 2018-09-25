const express = require('express');
const axios = require('axios');
const request = require('request');
const router = express.Router();
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const config = require('./config');
const searchFilters = require('./middleware/searchFilters.js');
const loadData = require('./middleware/loadData.js');
const session = require('express-session');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// default options
app.use(fileUpload());

const acl = require("./middleware/acl.js");

app.set('view engine', 'ejs');
app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 6000000 }}));

// Allow NODE to expose/route the paths
for (var key in config.asset_paths) {
  if (config.asset_paths.hasOwnProperty(key)) {
    app.use(key, express.static(__dirname + config.asset_paths[key]));
  }
}

let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Dynamic Routing
app.all('/:section/:node_id?/:action?', [acl, loadData], function (req, res) {
  console.log("App Started");
  //console.log(process.env.DB_PASS);
  console.log(req.params.section);

  if (req.params.section == 'upload') {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    // Use the mv() method to place the file somewhere on your server
    console.log(__dirname);
    sampleFile.mv('public/temp/' + sampleFile.name, function(err) {
      if (err) {
        console.log("ERRROOOOOOO" , sampleFile.name);
        return res.status(500).send(err);
      }
      res.send('File uploaded!');
      return;
    });
    return;
  }

  const rcmsRoute = require("./modules/router.js");
  let route = new rcmsRoute();
  let routeURL = route.routeURL(req.params, res, req);
});

app.all('/', [acl, searchFilters], function (req, res) {
  req.session.userLoggedIn = "Some is logged in now...";
  let rcmsRoute = require('./modules/router.js');
  let route = new rcmsRoute();
  let routeURL = route.routeURL(req.params, res, req);

});


/**/
//---------SOCKET COMMUNICATION-------------
http = require('http').Server(app),
io = require('socket.io')(http),
realtimeEditor = require('realtime-editor');
var socketPort = process.env.PORT || 3001;

/*
realtimeEditor.onSave(function (data) {
  console.log('realtimeEditor.onSave: ', data);
});
*/

http.listen(socketPort, function(){
  console.log('listening on *:' + socketPort);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
//---------------------------------------


app.listen(config.port);
