// Load media for Media Browser from Bento with optional filtering.
const { bentoApiEndpoint } = require('../../../config');
const axios = require('axios');
const express = require('express');
const api = require('../api.js');

const router = new express.Router();

router.get('/mediaSearch/:brandName?', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  axios.all([
    axios.get('http://localhost:4000/endpoints/images'),
    axios.get('http://localhost:4000/endpoints/videos'),
  ])
    .then(axios.spread((images, videos) => {
      console.log(images.data.imageData.html);
      console.log(videos.data.videoData.html);
      const imagesData = images.data.imageData;
      const videosData = videos.data.videoData;
      res.send({ imagesData, videosData });
    }));
});

module.exports = router;
