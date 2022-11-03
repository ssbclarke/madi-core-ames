let config = require('config');
config = {
  ...config,
  authorizationUri: config.apiBase + config.authorizationUri,
  accessTokenUri: config.apiBase + config.accessTokenUri,
  refreshTokenUri: config.apiBase + config.refreshTokenUri
};

module.exports = config