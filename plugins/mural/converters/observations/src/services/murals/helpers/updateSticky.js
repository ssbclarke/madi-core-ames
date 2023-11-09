const axios = require('axios');
const config = require('../../config')

async function updateSticky(req, id, update, fetchLib = axios){
  let {actId, muralId} = req.query
  
  update = update || {"style":{"backgroundColor":"#FF0000FF","border":true}}
  var data = JSON.stringify(update);

  let requestConfig = {
    method: 'patch',
    url: `${config.mural.base}/api/public/v1/murals/${actId}.${muralId}/widgets/sticky-note/${id}`,
    headers: { 
      'accept': 'application/json', 
      'Authorization': `Bearer ${req.cookies.access_token}`,
      'Content-Type': 'application/json'
    },
    data : data
  };
  return fetchLib(requestConfig)
    .then(()=>{
      console.log('marking ', id)
    })
    .catch(error=>{
      if(error.response && error.response.status !== 429 ){
        console.error(id, error.message)
      }
    })
}
module.exports = updateSticky