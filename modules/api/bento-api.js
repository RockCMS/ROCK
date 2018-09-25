const express = require('express');
const fs = require('fs');
const config = require('../../config');
const moment = require('moment');
const Rcms = require('../rcms.js');
const api = require('./api.js');
const bodyParser = require('body-parser');
const utils = require('../utils');
const session = require('express-session');
require('dotenv').config();

const sqlc = new Rcms();
sqlc.config(config);

const query = fs.readFileSync(`${__dirname}/bento.graphql`).toString();
const endpoint = 'https://staging.newsdigitalapi.com';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const Aimsify = (fullImage) => {
//   if (typeof fullImage !== 'undefined') {
//     const splitter = 'nbcnews.com/i/newscms/';
//     const firstPart = fullImage.split(splitter);
//     const extension = firstPart[1].substr(firstPart[1].length - 4);
//     const mainFile = firstPart[1].split(extension);
//     const fullAimsImage = firstPart[0] + 'nbcnews.com/j/newscms/' + mainFile[0] + '.focal-230x230' + extension;
//     // console.log(fullAimsImage);
//     return fullAimsImage;
//   }
//   return false;
// };


// Load endpoint routes.
const endpoints = require('./endpoints');

app.use('/endpoints', endpoints.ImageSearch);
app.use('/endpoints', endpoints.VideoSearch);
app.use('/endpoints', endpoints.MediaSearch);

// Load helper routes.
const helpers = require('./helpers');

app.use('/helpers', helpers.FeaturedLinks);
app.use('/helpers', helpers.AmazonProducts);
app.use('/helpers', helpers.VilynxRelated);


// Dashboard seaech results.
app.all('/jobyapi', async (req, res) => {
  const publisher = req.query.publisher ? req.query.publisher : "nbcnews";
  const type = req.query.content_type ? req.query.content_type : "article";
  const headline = req.query.headline ? req.query.headline : undefined;
  let currentUID = (req.query.uid) ? req.query.uid : 0;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  let LockedList = {};
  await sqlc.getLockedList(currentUID)
    .then((resultA) => {
      LockedList = resultA;
    })
  // ---- Local Access ----
  if (config.local) {
    const jsonObject = require('../../public/data/static-local-data/dashboard.json');
    res.json(jsonObject);
    return;
  }
  //-----------------------

  const response = await api(endpoint, { op: `${type}List`, filters: { publisher, type, headline } });

  const outputData = response.search.items;
  const pageInfo = response.search.pagination;

  const buttonColors = {
    0: 'info',
    1: 'warning',
    2: 'danger',
    3: 'success',
    4: 'primary'
  }

  const styleTaxonomy = (taxObj) => {
    let taxLabels = '<p>';
    // Style verticals.
    if (taxObj.primaryVertical.name !== 'News') {
      taxLabels += `<a class="btn btn-warning btn-xs">${taxObj.primaryVertical.name}/${taxObj.primarySection.name}</a> `;
    } else {
      // Style regular stories.
      taxLabels += `<a class="btn btn-primary btn-xs">${taxObj.primarySection.name}</a> `;
      if (taxObj.topics.length) {
        taxObj.topics.forEach((topic) => {
          taxLabels += `<a class="btn btn-${buttonColors[Math.floor(Math.random() * 5)]} btn-xs">${topic.name}</a> `;
        });
      }

    }
    taxLabels += '</p>';
    return taxLabels;
  };

  let i = 0;
  const jsonData = [];
  Object.keys(outputData).forEach((key) => {
    if (typeof outputData[key].id !== 'undefined') {
      //styleTaxonomy(outputData[key].taxonomy);
      let j = 0;
      let user_name;
      if (typeof outputData[key].authors !== 'undefined') {
        if (typeof outputData[key].authors[0] !== 'undefined') {
          user_name = outputData[key].authors[0].person.name;
        }
      }
      const nid = outputData[key].id;
      let title = (typeof outputData[key].headline !== 'undefined') ? outputData[key].headline.primary : '';
      const type = outputData[key].type;

      let datePublished = '';
      let dateModified = '';
      let timestamps = '';
      if (outputData[key].datePublished !== null) {
        datePublished = moment.utc(outputData[key].datePublished).local().format('YYYY-MM-DD HH:mm:ss');
        timestamps = `<small>Published: ${datePublished}</small><br />`;
      }
      if (outputData[key].datePublished !== null) {
        dateModified = moment.utc(outputData[key].dateModified).local().format('YYYY-MM-DD HH:mm:ss');
        timestamps += `<small>Modified: ${dateModified}</small>`;
      }
      let status = 'Published';
      if (moment(datePublished).unix() < moment(dateModified).unix()) {
        status += ',\n with new draft';
      }

      const siteName = (outputData[key].datePublished) ? outputData[key].publisher.name : '';
      let imageUrl = '';
      if (outputData[key].primaryImage !== null) {
        imageUrl = utils.aimsify(outputData[key].primaryImage.url.short);
      } else if (outputData[key].teaseImage !== null) {
        imageUrl = utils.aimsify(outputData[key].teaseImage.url.short);
      }
      if (imageUrl) {
        image = `<img height="60" width="70" src="${imageUrl}" data-toggle="modal" data-node-title="${title}" data-node-id="${nid}" id="${nid}-img" data-target="#modal-media-chooser">`;
      } else {
        image = `<a class="btn btn-app" data-toggle="modal" data-node-title="${title}" data-node-id="${nid}" id="${nid}-img" data-target="#modal-media-chooser"><i class="fa fa-plus"></i>Add image</a>`;
      }
      const liveUrl = (outputData[key].url.primary !== null) ? `<a href="${outputData[key].url.primary}" target="_blank">Go WWW</a>` : '';

      const pageURL = (typeof outputData[key].url.short !== 'undefined') ? outputData[key].url.short : '';

      const taxonomy = (siteName != 'msnbc') ? styleTaxonomy(outputData[key].taxonomy) : '';
      let locked = (LockedList.hasOwnProperty(nid)) ? '<i class="fa fa-fw fa-lock"></i>' : '';
      jsonData[i] = [image, '<a href="/node/' + nid + '/edit" class="dashboard-title">' + title + '</a>' + locked + taxonomy, `<img src = "/public/dist/images/${siteName}.png">&nbsp;${type}`, user_name, status, datePublished, dateModified, `<a class="copy-clip-board" data-val="${pageURL}" data-toggle="tooltip" data-placement="top" title="Copy Link">Copy URL</a><br />${liveUrl}`, `http://localhost:4000/jobyapi/${nid}`];
      user_name = (typeof user_name != 'undefined' || user_name != null) ? user_name : 'No Name';
      title = title.replace(/'/g, "\\'");
      user_name = user_name.replace(/'/g, "\\'");
      let query = `
      INSERT INTO contents
        (nid, title, type, user_name, image)
      VALUES
        ('` + nid + `', '` + title + `', '` + type + `', '` + user_name + `', '` + imageUrl + `')
      ON DUPLICATE KEY UPDATE
        nid = VALUES(nid)
      `;
      sqlc.getData(query);
      i++;
    }
  });

  const ajaxData = {
    page: pageInfo.page,
    recordsTotal: pageInfo.totalPages,
    recordsFiltered: 100,
    data: jsonData,
  }

  res.json(ajaxData);
});

// Generic content query.
app.get('/jobyapi/node/:nodeId', async (req, res) => {
  const { nodeId } = req.params;

  const { type } = utils.nidInfo(nodeId);

  if (type) {
    const result = await api(endpoint, { op: type, id: nodeId });
    Object.keys(result).forEach((node) => {
      if (result[node] !== null) {
        //        console.log(result[node]);
        res.send(result[node]);
      } else {
        res.status(204).send();
      }
    });
  }
});

app.get('/jobyapi/node-details/:node_id?', (req, res) => {
  const id = req.params.node_id;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  const axios = require('axios');
  const variables = {
    id,
  };
  const body = JSON.stringify({
    query,
    operationName: 'Article',
    variables,
  });


  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    }
  };

  axios.post(endpoint, body, axiosConfig)
    .then((output) => {
      const outputData = output.data.data.article;
      // console.log(outputData);
      let user_name = '';
      if (typeof outputData.authors !== 'undefined') {
        if (typeof outputData.authors[0] !== 'undefined') {
          user_name = outputData.authors[0].person.name;
        }
      }

      let image = '';
      if (typeof outputData.primaryImage !== "undefined" || outputData.primaryImage !== null) {
        if (outputData.primaryImage !== null) {
          image = outputData.primaryImage.url.primary;
        }
      }

      let url = '';
      if (typeof outputData.url !== "undefined" || outputData.url !== null) {
        url = outputData.url.short;
      }

      let contentBody = outputData.body;
      let contentString = '';

      Object.keys(contentBody).forEach(key => {
        //console.log(contentBody[key]);
        if (contentBody[key].element == 'p') {
          contentString = contentString + '<p>' + contentBody[key].html + '</p>';
        }
        //console.log("###########################");
      });

      let jsonData = {
        'nid': outputData.id,
        'headline': outputData.headline.primary,
        'description': outputData.description.primary,
        'dek': outputData.description.primary,
        'ecommerceEnabled': outputData.ecommerceEnabled,
        'url': url,
        'author': user_name,
        'image': image,
        'url': url,
        'body': contentString
      };
      //console.log(jsonData);

      res.json(jsonData);
      //console.log(output.data);
    })
    .catch((err) => {
      console.log("AXIOS ERROR: ", err);
    })
});

app.post('/submit/:node_id?', function (req, res) {
  var node_id = req.params.node_id;
  console.log(node_id);
  console.log('===============XXXXXXX=======');
  console.log(req.body.article_headline);
  console.log('===============XXXXXXX=======');

  var jsonObject = require("./msg_templates/article.json");

  jsonObject.entry.content = req.body.article_body;
  jsonObject.entry.summary = req.body.article_headline;
  jsonObject.entry.title = req.body.article_headline;
  //console.log(jsonObject.entry.content);

  var redirectPage = function (result) {
    return res.redirect('http://localhost:3000/article-edit/' + node_id + '/?f=s');
  }
  var result = sqlc.SendMSG(jsonObject, redirectPage);
  //res.json( {'id': '124'} );

});

// Media Endpoint
app.all('/media/', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  let imageBlocks = '';
  let videoBlocks = '';

  const imageList = await JSON.parse(fs.readFileSync('./modules/api/images.json', 'utf8'));
  Object.keys(imageList).forEach((key) => {
    imageBlocks += `
          <a href="#">
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
    html: imageBlocks,
    pageInfo: imagePagination,
  }

  const videos = await api(endpoint, { op: 'videoSearch', filters: { publisher: 'nbcnews', type: 'video' } });
  if (videos.search.items.length > 0) {
    Object.keys(videos.search.items).forEach((key) => {
      videoBlocks += `
            <a href="#">
              <figure>
                <img src="${videos.search.items[key].teaseImage.url.primary}" alt="${videos.search.items[key].description.primary}">
                <figcaption>
                  ${videos.search.items[key].headline.primary}
                </figcaption>
              </figure>
            </a>
            `;
    });
  }
  let videoPagination = '';
  if (videos.search.pagination.totalPages > 1) {
    for (let i = 1; i <= videos.search.pagination.totalPages; i++) {
      const activeTab = (i == videos.search.pagination.page) ? 'active' : '';
      videoPagination += `<li class="paginate_button ${activeTab}"><a href="#" aria-controls="example2" data-dt-idx="${i}" tabindex="0">${i}</a></li>`;
    }
  }
  const videoData = {
    html: videoBlocks,
    pageInfo: videoPagination,
  };

  res.send({ imageData, videoData });
});

app.get('/videos/:brandName?', (req, res) => {
  const brandName = (req.params.brandName) ? req.params.brandName.replace(/,/g, '') : '';
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  const axios = require('axios');

  const brandFilter = brandName ? ' AND publisher:\"' + brandName + '\"' : undefined;

  const variables = {
    filters: 'type=\"video\"' + brandFilter,
  };
  const body = JSON.stringify({
    query,
    operationName: 'getDidarulVideoList',
    variables,
  });

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
    },
  };

  axios.post(endpoint, body, axiosConfig)
    .then((output) => {
      const outputData = output.data.data.search.items;
      console.log(outputData);
    })
    .catch((err) => {
      console.log('AXIOS ERROR: ', err);
    });
});


app.post('/auto-tag', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  let searchKey = req.body.keyword;

  let autoTagContainer = '';
  let buttonStyles = {
    default: 'Default',
    primary: 'Default',
    success: 'Default',
    info: 'Default',
    danger: 'Default',
    warning: 'Default'
  }

  let keywords = {
    default: 'Politics',
    primary: 'President',
    success: 'Democrat',
    info: 'Cool Guy',
    danger: 'Awesome President',
    warning: 'Nice President'
  }

  Object.keys(buttonStyles).forEach((key) => {
    autoTagContainer += `
<div class="btn-group">
  <button type="button" class="btn btn-block btn-${key}">${keywords[key]}</button>
</div>
    `;
  });

  console.log("Search Key:", searchKey);
  if (searchKey.trim() == 'obama') {
    res.send(`Recommended Keywords for <strong>${searchKey}</strong>: ` + autoTagContainer);
  }
});


app.post('/unlock', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  sqlc.getData(`UPDATE contents SET locked = '0', locked_by = '0' WHERE nid = '${req.body.nid}'`);
  res.send(`This Document Unlocked`);
});

app.post('/auto-save', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  req.body.contentBody = req.body.contentBody.replace(/'/g, "\\'");
  sqlc.getData(`UPDATE contents SET revisions = '${req.body.contentBody}' WHERE nid = '${req.body.nid}'`);
  res.send(`<i class="fa fa-fw fa-save"></i>`);
});

app.listen(config.bento_api_port);
