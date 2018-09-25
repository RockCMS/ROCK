// RockCMS Router
//

var config = require('../../config');
const forms = require("../../modules/forms/forms.js");
let frm = new forms();

var rcms = require("../../modules/rcms.js");
var sqlc = new rcms();
sqlc.config(config);

module.exports = function () {
  return {
    render: function (urlParams, res, req) {
      const processData = (data) => {
        let userSession = req.session.userLoggedIn;
        req.session.userData = data;
        if (req._parsedOriginalUrl.query == 'process') {
          const brandsArr = req.session.userData.brands.split(',');
          req.session.userData.brands = brandsArr;
          //console.log(req.session.userData.brands);
          res.redirect('/');
          return;
        }

        res.render('login', {
          title: 'Login',
          userData: data,
          userSession: userSession,
         });
      }
      sqlc.fetchObj(`SELECT * FROM users where mail = '${req.body.user_name}'`, processData)
    },
  };
}

