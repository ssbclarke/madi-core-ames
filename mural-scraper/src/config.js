process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
console.log(process.env)
console.log(__dirname+"")
let config = require('config');
config = {
  ...config,
  muralAuthorizationUri: config.mural.base + config.mural.authorizationUri,
  muralAccessTokenUri: config.mural.base + config.mural.accessTokenUri,
  murealRefreshTokenUri: config.mural.base + config.mural.refreshTokenUri
};

console.log('CONFIG', config)
module.exports = config