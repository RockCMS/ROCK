// Middleware to load search filter options for the Dashboard
const config = require('../config');
const api = require('../modules/api/api.js');
const utils = require('../modules/utils');

const endpoint = 'https://staging.newsdigitalapi.com';

const loadData = async (req, res, next) => {
  if (utils.nidInfo(req.params.node_id)) {
    console.log(`MW:loadData: ${req.params.node_id}`);
    const { type } = utils.nidInfo(req.params.node_id);
    if (type) {
      const result = await api(endpoint, { op: type, id: req.params.node_id });
      Object.keys(result).forEach((node) => {
        if (result[node] !== null) {
          res.nodeData = result[node];
        } else {
          res.status(204).send();
        }
      });
    }
  }
  console.log('MW:loadData - No nid provided.');
  next();


  //   const pubs = Object.getOwnPropertyNames(config.rcmsPublishers).join('|');
  //   const ctypes = Object.getOwnPropertyNames(config.rcmsContentTypes).join('|');
  //   const matches = req.params.node_id.match(`(${pubs})(${ctypes})(.)`);
  //   if (matches && isValidGuid(matches)) {
  //     res.nodeData = await api(endpoint, { op: 'Article', id: req.params.node_id });
  //   }
  // }
  // next();
};

module.exports = loadData;
