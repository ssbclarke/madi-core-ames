import { VectorStore } from "langchain/dist/vectorstores/base";

class PGVectorStore extends VectorStore {
    /**
     * Add more documents to an existing VectorStore
     */
    addDocuments(documents: Document[]): Promise<void>{
      const texts = documents.map(({ pageContent }) => pageContent);
      await this.addVectors(
        await this.embeddings.embedDocuments(texts),
        documents,
        options
      );
    }
    }
  
    /**
     * Search for the most similar documents to a query
     */
    similaritySearch(
      query: string,
      k?: number,
      filter?: object | undefined
    ): Promise<Document[]>;
  
    /**
     * Search for the most similar documents to a query,
     * and return their similarity score
     */
    similaritySearchWithScore(
      query: string,
      k = 4,
      filter: object | undefined = undefined
    ): Promise<[object, number][]>;
  
    /**
     * Turn a VectorStore into a Retriever
     */
    asRetriever(k?: number): BaseRetriever;
  
    /**
     * Advanced: Add more documents to an existing VectorStore,
     * when you already have their embeddings
     */
    addVectors(vectors: number[][], documents: Document[]): Promise<void>;
  
    /**
     * Advanced: Search for the most similar documents to a query,
     * when you already have the embedding of the query
     */
    similaritySearchVectorWithScore(
      query: number[],
      k: number,
      filter?: object
    ): Promise<[Document, number][]>;
  }