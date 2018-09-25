// RockCMS Router
const config = require('../config');

module.exports = function () {
  // Test if a guid is valid.
  const isValidGuid = (guid) => {
    if (config.rcmsPublishers[guid[1]] && config.rcmsContentTypes[guid[2]] && parseInt(guid[3])) {
      return true;
    }
    return false;
  }

  return {
    routeURL: (urlParams, res, req) => {
      urlParams.section = (typeof urlParams.section !== 'undefined') ? urlParams.section : '';
      let routeTo = '../content_types/dashboard/dashboard.js';
      if (req._parsedOriginalUrl.path === '/') {
        routeTo = '../content_types/dashboard/dashboard.js';
      } else {
        if (urlParams.section === 'login') {
          routeTo = '../content_types/login/login.js';
        }
        // Route to content type module.
        if (urlParams.section === 'node') {
          if (urlParams.node_id === 'add' && urlParams.action === 'article') {
            routeTo = '../content_types/article/article.js';
          }
          // Create GUID regex pattern.
          const pubs = Object.getOwnPropertyNames(config.rcmsPublishers).join('|');
          const ctypes = Object.getOwnPropertyNames(config.rcmsContentTypes).join('|');
          const matches = urlParams.node_id.match(`(${pubs})(${ctypes})(.)`);
          if (matches !== null && isValidGuid(matches)) {
            routeTo = `../content_types/${config.rcmsContentTypes[matches[2]]}/${config.rcmsContentTypes[matches[2]]}.js`;
          }
        }
        if (urlParams.section.match(/^(test|submit)$/)) {
          routeTo = '../content_types/test/test.js';
        }
        if (urlParams.section.match(/^(test2)$/)) {
          routeTo = '../content_types/test2/test2.js';
        }

      }
      console.log(`routeTo: ${routeTo}`);
      const ContentMain = require(routeTo);
      const contentType = new ContentMain();
      return contentType.render(urlParams, res, req);

    },
  };
}
