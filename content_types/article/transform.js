// Transform API node response into flattened object.
const utils = require('../../modules/utils');
const moment = require('moment');

module.exports = function transform(node) {
  return {
    transform: function (node) {
      let body = '';
      if (node.body !== null) {
        Object.keys(node.body).forEach((key) => {
          if (node.body[key].element == 'p') {
            body = body + '<p>' + node.body[key].html + '</p>';
          }
        });
      }

      headlinePrimary = node.headline.primary;
      headlineSeo = node.headline.seo;
      headlineSocial = node.headline.social;
      descriptionPrimary = node.description.primary;
      descriptionSeo = node.description.primary;
      urlPrimary = node.url.primary;
      urlShort = node.url.short;
      adsEnabled = node.adsEnabled;
      searchable = node.searchable;
      ecommerceEnabled = node.ecommerceEnabled;
      sponsoredBy = node.sponsoredBy;
      hidden = node.hidden;
      nativeAd = node.nativeAd;
      breakingNews = node.breakingNews;
      deck = node.dek;
      body = body;
      mainArt = (node.primaryImage !== null) ? utils.aimsify(node.primaryImage.url.primary) : '';
      teaseArt = (node.teaseImage !== null) ? utils.aimsify(node.teaseImage.url.primary) : '';
      datePublished = moment.utc(node.datePublished).local().format('YYYY-MM-DD HH:mm:ss');
      dateModified = moment.utc(node.dateModified).local().format('YYYY-MM-DD HH:mm:ss')

      return {
        headlinePrimary,
        headlineSeo,
        headlineSocial,
        descriptionPrimary,
        descriptionSeo,
        urlPrimary,
        urlShort,
        adsEnabled,
        searchable,
        ecommerceEnabled,
        sponsoredBy,
        hidden,
        nativeAd,
        breakingNews,
        deck,
        body,
        mainArt,
        teaseArt,
        datePublished,
        dateModified
      };
    }
  }
}
