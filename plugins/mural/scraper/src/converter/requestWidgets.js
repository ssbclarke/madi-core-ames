const config = require('../config')
const axios = require('axios');


async function requestWidgets(actId, muralId, authToken, storage = [], next){
  // console.log(config)
  let requestConfig = {
    method: 'get',
    url: `${config.mural.base}/api/public/v1/murals/${actId}.${muralId}/widgets`,
    headers: { 
      'accept': 'application/json', 
      'Authorization': `Bearer ${authToken}`
    }
  };
  let localConfig = Object.assign({},requestConfig)
  if(next){
    localConfig.url = localConfig.url+`?next=${next}`
  }

  return axios(localConfig)
    .then(function (response) {
      let { next, value } = response.data
      if(next){
        console.log('fetching next: ', next, value.length)
        storage.push(...value)
        return requestWidgets(actId, muralId, authToken, storage, next)
      }else{
        return storage
      }
    })

}
module.exports = requestWidgets