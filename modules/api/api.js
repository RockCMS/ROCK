const axios = require('axios');
const fs = require('fs');
const query = fs.readFileSync(`${__dirname}/bento.graphql`).toString();

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    "Access-Control-Allow-Origin": "*",
  }
};

async function api(endpoint, options) {

  // Format filter properties.
  // If filters are present iterate through them and construct a 'filters' string.
  let filters = "";
  if (options.hasOwnProperty('filters')) {
    let items = [];
    Object.keys(options.filters).forEach(key => {
      if (options.filters[key] !== undefined) {
        if (key == 'url') {
          items.push(`${key}:"${options.filters[key]}"`);
        } else {
          items.push(`${key}:${options.filters[key]}`);
        }
      }
    });
    filters = items.join(' AND ');
  }

  let search = ""
  // Format search strings.
  if (options.query) {
    search = options.query;
  }
  const variables = {
    id: options.id ? options.id : undefined,
    filters: filters ? filters : undefined,
  };

  const body = JSON.stringify({
    query,
    operationName: options.op,
    variables,
  });
  try {
    response = await axios.post(endpoint, body, axiosConfig)
  } catch (e) {
    console.log(e);
  }

  const { status, statusText } = response;
  if (status !== 200) {
    throw new Error(`Error: ${statusText}`);
  }

  try {
    responseJSON = response.data.data;
    return responseJSON;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = api;
