// Retrieve images from Bento with optional filtering.
const { bentoApiEndpoint } = require('../../../config');
const express = require('express');
const fs = require('fs');
const api = require('../api.js');

const router = new express.Router();

router.get('/images/:brandName?', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  ///// This code will work once there is an image query from Bento available.
  // const result = {
  //   data: null,
  //   pageInfo: null,
  // };

  // const videos = await api(bentoApiEndpoint, { op: 'imageSearch', filters: { publisher: 'nbcnews', type: 'image' } });
  // if (images.search.items.length > 0) {
  //   res.send({
  //     data: images.search.items,
  //     pageInfo: images.search.pagination,
  //   });
  // } else {
  //   res.send(result);
  // }

  let imageBlocks = '';

  const imageList = await JSON.parse(fs.readFileSync('./modules/api/endpoints/images.json', 'utf8'));
  Object.keys(imageList).forEach((key) => {
    imageBlocks += `<a href="#">
  <figure>
    <img src="${imageList[key].filename}" alt="${imageList[key].alt}">
    <figcaption>
      ${imageList[key].title}
    </figcaption>
  </figure>
</a>
`;
  });
  let imagePagination = '';
  if (imageList.length > 1) {
    for (let i = 1; i <= 10; i++) {
      const activeTab = (i === 1) ? 'active' : '';
      imagePagination += `<li class="paginate_button ${activeTab}"><a href="#" aria-controls="example2" data-dt-idx="${i}" tabindex="0">${i}</a></li>`;
    }
  }
  const imageData = {
    data: imageList,
    html: imageBlocks,
    pageInfo: imagePagination,
  };
  if (imageBlocks) {
    res.send({ imageData });
  } else {
    res.send(null);
  }
});

module.exports = router;
