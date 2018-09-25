//alert("HELLO X");

//var firebaseRef = firebase.database().ref();

//firebaseRef.child("users").child("didar").set("hello hello")
//console.log("DIDAR");


console.log("I am a new app");


var user = function (userName) {
  var userObj = {
    userName : userName,
    userDetails : {
      fName : "Jonathan",
      lName : "Rivera",
      email: 'jrivera@aol.com',
      title: 'Sales Marketing',
    },
  }
  return userObj
}




var fs = require('fs'),
readline = require('readline');
var rd = readline.createInterface({
    input: fs.createReadStream('/www/htdocs/rock-cms/data.csv'),
    //output: process.stdout,
    console: false
});

counter = 0;
rd.on('line', function(line) {
    console.log(counter + ':' + line);

    var col = line.split(',');
    console.log(col);

    counter++;
});



var userInst = user('devAngel');
userInst.userDetails = {
  fName : "Barack",
  lName : "Obama",
  email: 'bobama@aol.com',
  title: 'President',
}

//console.log(userInst.userDetails);




for (var k in userInst) {
    if (userInst.hasOwnProperty(k)) {
      //console.log(ky[k]);
      //console.log(k +':' + userInst[k]);



    }
}


    for(let x of Object.values(userInst.userDetails)){
        console.log(x);
    }
