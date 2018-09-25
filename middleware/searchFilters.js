// Middleware to load search filter options for the Dashboard
const api = require('../modules/api/api.js');
const endpoint = 'https://staging.newsdigitalapi.com';

const searchFilters = async (req, res, next) => {
  const response = await api(endpoint, { op: 'getTaxonomy', filters: { publisher: 'nbcnews', taxonomyType: 'section', type: 'taxonomy'} });
  req.sections = response.search.items;
  next();
}

module.exports = searchFilters;
