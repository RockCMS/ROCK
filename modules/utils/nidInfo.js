// Return information about an node id.
const { rcmsPublishers, rcmsContentTypes } = require('../../config');

const isValidGuid = (guid) => {
  if (rcmsPublishers[guid[1]] && rcmsContentTypes[guid[2]] && parseInt(guid[3])) {
    return true;
  }
  return false;
};

const nidInfo = (node_id = '') => {
  // Create GUID regex pattern.
  const pubs = Object.getOwnPropertyNames(rcmsPublishers).join('|');
  const ctypes = Object.getOwnPropertyNames(rcmsContentTypes).join('|');
  const matches = node_id.match(`(${pubs})(${ctypes})(.*)`);
  if (matches !== null && isValidGuid(matches)) {
    return {
      publisher: rcmsPublishers[matches[1]],
      type: rcmsContentTypes[matches[2]],
      id: matches[3],
    };
  }
  return false;
};

module.exports = nidInfo;
