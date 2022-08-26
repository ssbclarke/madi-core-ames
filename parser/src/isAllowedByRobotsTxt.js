
var URL = require('url');

var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); 

function convertUrl(originalURL){
    let url = new URL(originalURL)
    
    // unique robots key
    // url.origin+'/robots.txt'

    // unique url key
    // url.origin + url.pathname
}

function fetchRobotsTxt(url){

}



const isAllowedByRobotsTxt = (url)=>{
    url = new URL(url)
    
    // standardize the url
    // split out the domain
    // check robotsRecords for file
        // if yes, return check allowed
        // if no, fetch robots.txt
            //if there
                // store
                // return check allowed
            //not
                // store
                // return allowed    
}





export default isAllowedByRobotsTxt