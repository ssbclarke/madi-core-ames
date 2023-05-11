import { createClient, SchemaFieldTypes, VectorAlgorithms } from 'redis';
const VECTOR = Symbol('search:vector');
const HYBRID = Symbol('search:hybrid');
let client;

const INDEX_NAME = "embedding-index"
const VECTOR_NAME = "vss"
const NUM_VECTORS = 4000
const PREFIX = "embedding"
const VECTOR_DIM = 1536
const DISTANCE_METRIC = "COSINE"

let redisIntervalId




function float32Buffer(arr) {
    return Buffer.from(new Float32Array(arr).buffer);
}
function redisKey(key) {
    return `${PREFIX}:${key}`;
}
// close redis client connection if it's the last required process
function closeRedis() {
    // 2 core processes plus Redis and interval
    var minimumProcesses = 4;
    if (process._getActiveHandles().length > minimumProcesses)
        return;
    clearInterval(redisIntervalId);
    client.unref();
}



export const init = async ()=>{
    
    client = createClient({
        // url: 'redis://alice:foobared@awesome.redis.server:6380'
    })
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    // redisIntervalId = setInterval(closeRedis, 500);
    return client
}




export const add = async (id, embedding)=>{
    try{
        return client.hSet(redisKey(id), { [VECTOR_NAME]: float32Buffer(embedding) })
    }catch(e){
        console.log(e)
    }
}

export const search = async (embedding)=>{
    // client.connect()
    // let { queryVector: [], searchType = VECTOR,  } = params

    // switch(searchType){
    //     case VECTOR:
    //         query = '*=>[KNN {TOPK} @image_vector $vec_param AS vector_score]'
    //     case HYBRID:
    //         query = '(@image_id:{{{hyb_str}}})=>[KNN {TOPK} @image_vector $vec_param AS vector_score]'
    // }
    // return client.ft.search('idx:animals', '@species:{dog}');

    // Perform a K-Nearest Neighbors vector similarity search
    // Documentation: https://redis.io/docs/stack/search/reference/vectors/#pure-knn-queries
    return await client.ft.search(INDEX_NAME, `*=>[KNN $TOPK @${VECTOR_NAME} $BLOB AS dist]`, {
        PARAMS: {
            BLOB: float32Buffer(embedding),
            TOPK: 4,
        },
        SORTBY: 'dist',
        DIALECT: 2,
        RETURN: ['dist']
    })
    .then(r=>{
        // console.log('in the then')
        r.documents = r.documents.map(d=>{
            d.id = d.id.slice(PREFIX.length+1) //strips prefix
            return d
        })
        return r
    })
    .catch(e=>{
        console.log(e)
    })
}



export const createIndex = async()=>{
    // Create an index...
    // Documentation: https://redis.io/docs/stack/search/reference/vectors/
    // await client.ft.dropIndex(INDEX_NAME)
    return await client.ft.create(INDEX_NAME, {
        [VECTOR_NAME]: {
            type: SchemaFieldTypes.VECTOR,
            ALGORITHM: VectorAlgorithms.HNSW,
            TYPE: 'FLOAT32',
            DIM: VECTOR_DIM,
            DISTANCE_METRIC,
            INITIAL_CAP: NUM_VECTORS
        }
    }, {
        ON: 'HASH',
        PREFIX
    }).catch(e=>{
        if (e.message === 'Index already exists') {
            console.log('Index exists already, skipped creation.');
        } else {
            // Something went wrong, perhaps RediSearch isn't installed...
            console.error(e);
            process.exit(1);
        }
    })
}
