// VectorStore wrapper around a Postgres/PGVector database.

const { VectorStore } = require('langchain/dist/vectorstores/base')
const logging = require('logging')
const uuid = require('uuid')


const ADA_TOKEN_COUNT = 1536
const _LANGCHAIN_DEFAULT_COLLECTION_NAME = "langchain"


// class BaseModel extends Base{
//     uuid = SQLALCHEMY.Column(UUID(as_uuid = True), primary_key = True, default=uuid.uuid4)
// }

// class CollectionStore extends BaseModel{
//     __tablename__ = "langchain_pg_collection"
//     name = SQLALCHEMY.Column(SQLALCHEMY.String);
//     cmetadata = SQLALCHEMY.Column(JSON);

//     embeddings = relationship(
//         "EmbeddingStore",
//         back_populates = "collection",
//         passive_deletes = True,
//     );

//     static get_by_name(session: Session, name: str) -> Optional["CollectionStore"]{
//         return session.query(cls).filter(cls.name == name).first();
//     };

//     static get_or_create(
//         session: Session,
//         name: str,
//         cmetadata: Optional[Dict] = None,
//     ) -> Tuple["CollectionStore", bool]{
//         created = False;
//         collection = cls.get_by_name(session, name);
//         if (collection) {
//             return collection, created;
//         };

//         collection = cls(name = name, cmetadata = cmetadata);
//         session.add(collection);
//         session.commit();
//         created = True;
//         return collection, created;
//     };
// }

// class EmbeddingStore(BaseModel) {
//     __tablename__ = "langchain_pg_embedding"

//     collection_id = join(
//         f"{CollectionStore.__tablename__}.uuid",
//         ondelete = "CASCADE",
//     );
//     collection = relationship(CollectionStore, back_populates = "embeddings");

//     embedding = SQLALCHEMY.Column(Vector(ADA_TOKEN_COUNT));
//     document = SQLALCHEMY.Column(SQLALCHEMY.String, nullable = True);
//     cmetadata = SQLALCHEMY.Column(JSON, nullable = True);

//     // custom_id : any user defined id
//     custom_id = SQLALCHEMY.Column(SQLALCHEMY.String, nullable = True);
// }

// class QueryResult {
//     EmbeddingStore: EmbeddingStore;
//     distance: float;
// }

// class DistanceStrategy(SQLALCHEMY.String, enum.Enum) {
//     EUCLIDEAN = EmbeddingStore.embedding.l2_distance;
//     COSINE = EmbeddingStore.embedding.cosine_distance;
//     MAX_INNER_PRODUCT = EmbeddingStore.embedding.max_inner_product;
// }

const DEFAULT_DISTANCE_STRATEGY = DistanceStrategy.EUCLIDEAN

class PGVector extends VectorStore {
    constructor(
        connection_string,
        embedding_function,
        collection_name = _LANGCHAIN_DEFAULT_COLLECTION_NAME,
        collection_metadata = null,
        distance_strategy = DEFAULT_DISTANCE_STRATEGY,
        pre_delete_collection = False,
        logger = None,
    ) {
        this.connection_string = connection_string;
        this.embedding_function = embedding_function;
        this.collection_name = collection_name;
        this.collection_metadata = collection_metadata;
        this.distance_strategy = distance_strategy;
        this.pre_delete_collection = pre_delete_collection;
        this.logger = logger || logging.getLogger(__name__)
        this.__post_init__()
    }

    __post_init__() {
        this._conn = this.connect();
        this.create_tables_if_not_exists();
        this.create_collection();
    }

    connect() {
        let engine = SQLALCHEMY.create_engine(this.connection_string);
        let conn = engine.connect();
        return conn;
    }

    create_tables_if_not_exists() {
        Base.metadata.create_all(this._conn);
    }

    drop_tables() {
        Base.metadata.drop_all(this._conn);
    }

    createCollection() {
        if (this.preDeleteCollection) {
            this.deleteCollection();
        }
        const session = new Session(this._conn);
        CollectionStore.getOrCreate(
            session,
            this.collectionName,
            cmetadata = this.collectionMetadata
        );
    }

    deleteCollection() {
        console.debug("Trying to delete collection");
        const session = new Session(this._conn);
        const collection = this.getCollection(session);
        if (!collection) {
            console.warn("Collection not found");
            return;
        }
        session.delete(collection);
        session.commit();
    }

    getCollection(session) {
        return CollectionStore.getByName(session, this.collectionName);
    }

    addTexts(texts, metadatas = null, ids = null, ...kwargs) {

        if (!ids) {
            ids = texts.map(text => uuid.v1());
        }

        const embeddings = this.embeddingFunction.embedDocuments(texts);

        if (!metadatas) {
            metadatas = texts.map(() => { });
        }

        const session = new Session(this._conn);
        const collection = this.getCollection(session);
        if (!collection) {
            throw new Error("Collection not found");
        }

        const embeddingStores = texts.map((text, i) => {
            return new EmbeddingStore(
                embeddings[i],
                text,
                metadatas[i],
                ids[i]
            );
        });

        embeddingStores.forEach(embeddingStore => {
            collection.embeddings.push(embeddingStore);
            session.add(embeddingStore);
        });
        session.commit();

        return ids;
    }

    // similaritySearch(query, k = 4, filter = null) {
    //     const embedding = this.embeddingFunction.embedQuery(text = query);
    //     return this.similaritySearchByVector({
    //         embedding: embedding,
    //         k: k,
    //         filter: filter
    //     });
    // }

    // similaritySearchWithScore(query, k = 4, filter = null) {
    //     const embedding = this.embeddingFunction.embedQuery(query);
    //     const docs = this.similaritySearchWithScoreByVector({
    //         embedding: embedding,
    //         k: k,
    //         filter: filter
    //     });
    //     return docs;
    // }



    similaritySearchWithScoreByVector(embedding, k = 4, filter = null) {
        const session = new Session(this._conn);
        const collection = this.getCollection(session);
        if (!collection) {
            throw new Error("Collection not found");
        }

        let filterBy = EmbeddingStore.collection_id == collection.uuid;

        if (filter) {
            let filterClauses = [];

            for (const [key, value] of Object.entries(filter)) {
                // Check if value is a dictionary and contains the "in" key (case insensitive)
                if (value instanceof Object && "in" in Object.keys(value).map(key => key.toLowerCase())) {
                    const valueCaseInsensitive = {};
                    Object.keys(value).forEach((key) => {
                        valueCaseInsensitive[key.toLowerCase()] = value[key];
                    });
                    const filterByMetadata = EmbeddingStore.cmetadata[key].astext.in_(valueCaseInsensitive["in"]);
                    filterClauses.push(filterByMetadata);
                } else {
                    const filterByMetadata = EmbeddingStore.cmetadata[key].astext == String(value);
                    filterClauses.push(filterByMetadata);
                }
            }

            filterBy = and_(filterBy, ...filterClauses);
        }

        const queryResult = session.query(
            EmbeddingStore,
            this.distanceStrategy(embedding).label("distance")
        )
            .filter(filterBy)
            .order_by(asc("distance"))
            .join(
                CollectionStore,
                EmbeddingStore.collection_id == CollectionStore.uuid
            )
            .limit(k)
            .all();

        const docs = queryResult.map(result => ([
            new Document(
                result.EmbeddingStore.document,
                result.EmbeddingStore.cmetadata
            ),
            this.embeddingFunction ? result.distance : null
        ]));

        return docs;
    }

    similaritySearchByVector(embedding, k = 4, filter = null) {
        const docsAndScores = this.similaritySearchWithScoreByVector(embedding, k, filter);
        const docs = docsAndScores.map(doc => doc[0]);
        return docs;
    }

    static fromTexts(
        texts,
        embedding,
        metadatas = null,
        collectionName = _LANGCHAIN_DEFAULT_COLLECTION_NAME,
        distanceStrategy = DistanceStrategy.COSINE,
        ids = null,
        preDeleteCollection = false,
        ...kwargs
    ) {
        const connection_string = this.getConnectionString(kwargs);
        const store = new PGVector(
            connection_string,
            collectionName,
            embedding,
            distanceStrategy,
            preDeleteCollection
        );
        store.addTexts(texts, metadatas, ids, ...kwargs);
        return store;
    }


    static getConnectionString(kwargs) {
        let connectionString = this.getFromDictOrEnv(kwargs, 'connection_string', 'PGVECTOR_CONNECTION_STRING');
        if (!connectionString) {
            throw new Error('Postgres connection string is required. Either pass it as a parameter or set the PGVECTOR_CONNECTION_STRING environment variable.');
        }
        return connectionString;
    }

    static fromDocuments(
        documents,
        embedding,
        collectionName = _LANGCHAIN_DEFAULT_COLLECTION_NAME,
        distanceStrategy = DEFAULT_DISTANCE_STRATEGY,
        ids = null,
        preDeleteCollection = false,
        ...kwargs
    ) {
        let texts = documents.map((d) => d.page_content);
        let metadatas = documents.map((d) => d.metadata);
        let connection_string = this.getConnectionString(kwargs);
        kwargs.connection_string = connection_string;
        return this.fromTexts(
            texts,
            embedding,
            metadatas,
            collectionName,
            distanceStrategy,
            ids,
            preDeleteCollection,
            ...kwargs
        );
    }

    static connectionStringFromDbParams(driver, host, port, database, user, password) {
        return `postgresql+${driver}://${user}:${password}@${host}:${port}/${database}`;
    }
}