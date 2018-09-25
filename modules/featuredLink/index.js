// Fetch metadata from the Bento API
const { bentoApiEndpoint } = require('../../config');
const api = require('../../modules/api/api');

const url = 'https://www.nbcnews.com/mach/science/here-s-how-rising-seas-could-swallow-these-coastal-cities-ncna872466';


const featuredLink = (url) => {
  api(bentoApiEndpoint, { op: 'getFeaturedLinkInfo', filters: { url } })
    .then((data) => {
      if (data.data.search.items.length !== 0 && typeof data.data.search.items[0].url !== 'undefined') {
        console.log(data.data.search.items[0]);
        return data.data.search.items[0];
      }
      console.log('Unable to retrieve link SVGMetadataElement.');
      return null;
    });
};

module.exports = featuredLink();
