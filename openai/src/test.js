import { extract, extractFromHtml } from '@extractus/article-extractor'
import got from 'got';

let url = "https://www.nationalacademies.org/news/2015/02/climate-intervention-is-not-a-replacement-for-reducing-carbon-emissions-proposed-intervention-techniques-not-ready-for-wide-scale-deployment"

let output = await extract(url)
if(!output){
    output = await got(url).text();
    // console.log(output)
    // output = await extractFromHtml(output)
}
console.log(output)
