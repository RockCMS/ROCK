// Retrieve videos from Bento with optional filtering.
const { bentoApiEndpoint } = require('../../../config');
const express = require('express');
const api = require('../api.js');

const router = new express.Router();

router.get('/videos/:brandName?', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  let videoBlocks = '';

  const result = {
    data: null,
    pageInfo: null,
  };

  const videos = await api(bentoApiEndpoint, { op: 'videoSearch', filters: { publisher: 'nbcnews', type: 'video' } });
  if (videos.search.items.length > 0) {
    Object.keys(videos.search.items).forEach((key) => {
      videoBlocks += `<a href="#">
  <figure>
    <img src="${videos.search.items[key].teaseImage.url.primary}" alt="${videos.search.items[key].description.primary}">
    <figcaption>
      ${videos.search.items[key].headline.primary}
    </figcaption>
  </figure>
</a>
`;
    });
    const videoData = {
      data: videos.search.items,
      html: videoBlocks,
      pageInfo: videos.search.pagination,
    };
    res.send({ videoData });
  } else {
    res.send(result);
  }
});

module.exports = router;
