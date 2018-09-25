// Helper rout to retrieve featured link metadata.
const { bentoApiEndpoint } = require('../../../config');
const express = require('express');
const api = require('../api.js');

const router = new express.Router();

router.get('/featuredLinks', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  const { url } = req.query;

  await api(bentoApiEndpoint, { op: 'getFeaturedLinkInfo', filters: { url } })
    .then((data) => {
      if (data.search.items.length !== 0 && typeof data.search.items[0].url !== 'undefined') {
        //console.log("results");
        //console.log(data.search.items[0]);
        res.send(data.search.items[0]);
      } else {
        console.log('Unable to retrieve link metadata.');
      }
    });
});

module.exports = router;
