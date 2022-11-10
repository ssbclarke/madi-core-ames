let config = require('config');
config = {
  ...config,
  muralAuthorizationUri: config.mural.base + config.mural.authorizationUri,
  muralAccessTokenUri: config.mural.base + config.mural.accessTokenUri,
  murealRefreshTokenUri: config.mural.base + config.mural.refreshTokenUri
};

// console.log(config)
module.exports = config