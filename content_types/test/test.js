// TEST PLAYGROUND

const config = require('../../config');
const Rcms = require('../../modules/rcms.js');
const fieldConfig = require('../article/field-config.json');
const NodeObj = require('../../modules/node.js');

const sqlc = new Rcms();
sqlc.config(config);

const articleEndpoint = 'http://localhost:4000/jobyapi/node-details/';
const node = new NodeObj();

module.exports = function () {
  return {
    render: (urlParams, res, req) => {
      const nodeData = res.nodeData || null;

      const savedFlag = (urlParams.section === 'submit') ? true : false;

      let topInputBoxes = [];

      const currentBrand = 'nbcnews';
      node.article(nodeData, {
        endPoint: articleEndpoint,
        savedFlag,
        userData: req.session.userData,
        reqData: req,
        dal: sqlc,
        currentBrand,
        template: {
          handler: res,
          template: 'test',
          data: { fieldConfig, topInputBoxes },
        },
      });
    },
  };
};
