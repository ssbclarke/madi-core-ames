const config = require('../../config')
const axios = require('axios');

async function requestWidgets(query, authToken, storage = [], next){
  // console.log(config)
  let requestConfig = {
    method: 'get',
    url: `${config.mural.base}/api/public/v1/murals/${query.actId}.${query.muralId}/widgets`,
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
        return requestWidgets(query, authToken, storage, next)
      }else{
        return storage
      }
    })

}
module.exports = requestWidgets