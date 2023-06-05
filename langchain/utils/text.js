import { createHash } from 'crypto'
import normalizer from 'normalize-url';

export function getIdFromText(text){
    return createHash('sha1').update(text).digest('hex')
}

export function normalizeUrl(url){
    return normalizer(url, {stripProtocol: true} )
}

export function getIdFromFileBuffer(fileBuffer){
    const hashSum = createHash('sha1');
    hashSum.update(fileBuffer);
    const hex = hashSum.digest('hex');
    return hex
}
