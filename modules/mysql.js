var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "bdp_bdpage",
  password: "eastcedar",
  database: "newscms"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM newscms.node LIMIT 2", function (err, result, fields) {
    if (err) throw err;

    for (var k in result) {
        if (result.hasOwnProperty(k)) {
          var rowData = result[k];
          console.log(rowData.title);
          //console.log(k +':' + users[k]);
        }
    }


    for(let x of Object.values(result)){
        //console.log(x);
    }

    //console.log(result);
  });
});
