// RockCMS Router
//

var config = require('../../config');

var rcms = require("../../modules/rcms.js");
var sqlc = new rcms();
sqlc.config(config);

module.exports = function () {

  // Sample sections.
  const sections = {
    nctx19666: "Better",
    nctx77: "Business",
    nctx19359: "Dateline Detective",
    nctx19136: "Education Nation",
    nctx20181: "Feature",
    nctx19081: "Flashback",
    nctx18446: "Guides",
    nctx65: "Health"
  }

  return {
    render: function (urlParams, res, req) {

      if (req.session.userData== undefined) {
        res.redirect('/login');
        return;
      }

      let selectSite = `<select name = "selectSite" id = "selectSite" class="select"><option val ="" selected = "">Select a Brand</option>`;
      Object.keys(req.session.userData.brands).forEach((key) => {
        let selectedStr = (typeof req.query.publisher != 'undefined' && req.query.publisher == req.session.userData.brands[key]) ? ' selected = "selected"' : '';
        selectSite += `<option value="${req.session.userData.brands[key]}">${req.session.userData.brands[key]}</option>`;
      });
      selectSite += `</select>`;

      let userSession = req.session.userLoggedIn;
      const headline = req.query.headline;
      const content_type = req.query.content_type;
      console.log("Current Page: Dashboard");
      //console.log(req.session.userData);
      let currentBrand = '';
      res.render('dashboard', {
        title: 'Hey',
        headline,
        content_type,
        sections: req.sections,
        userData: req.session.userData,
        userSession: userSession,
        currentBrand,
        selectedSite: selectSite,
        data: {
          assignments: [
            {
              assignmentType: 'photo',
              dateModified: '9:32p',
              title: 'Trump overstates what he\'s \'accomplished.\' Again.',
              comment: 'Can you add a cover photo please?',
              requestor: 'Anna Brand'
            },
          ]
        }
       });
    },
  };
}

