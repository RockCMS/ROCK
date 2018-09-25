// Helper rout retrieve related videos from Vylinx.
const express = require('express');
const axios = require('axios');
const utils = require('../../../modules/utils');

const vilynxSearch = 'https://www.vilynx.com/api2.0/semantic_search?search=';
const userHash = '&user-hash=a5d3c400d9872cc4aa3bb4e9c87c7cab';
const contentType = '&content-type=video';
const limit = '&limit=5';

const router = new express.Router();

router.get('/vilynx-related', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  const terms = encodeURI(req.query.search);

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  };


  const body = JSON.stringify({
  });

  try {
    response = await axios.get(`${vilynxSearch}${terms}${userHash}${contentType}${limit}`, body, axiosConfig);
  } catch (e) {
    console.log(e);
  }

  const { status, statusText } = response;
  if (status !== 200) {
    throw new Error(`Error: ${statusText}`);
  }

  try {
    const videoList = response.data.results;
    let videoBlocks = '';
    let videoThumb = '';
    let guid = '';
    Object.keys(videoList).forEach((key) => {
      if (videoList[key].thumbnails !== null) {
        videoThumb = utils.aimsify(`https://${videoList[key].thumbnails[0]}`);
      } else {
        videoThumb = '/public/dist/images/blank1.jpg';
      }
      if (videoList[key].guid !== null && typeof videoList[key].guid === 'string') {
        guid = videoList[key].guid;
      } else if (videoList[key].guids !== null) {
        guid = videoList[key].guids[0];
      }

      videoBlocks += `<a href="#">
<figure>
  <img src="${videoThumb}" alt="${videoList[key].description || 'NO DESCRIPTION'}">
  <figcaption>
  ${videoList[key].title || 'NO TITLE'}
  ${guid}
  </figcaption>
</figure>
</a>
`;
    });

    res.status(200).send(videoBlocks);
  } catch (e) {
    throw new Error(e);
  }
});

module.exports = router;
