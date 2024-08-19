import { PineconeStore } from "@langchain/pinecone";
import initPinecone from "./pineconeClient";
import { OpenAIEmbeddings } from "@langchain/openai";

export default async function createRetriever(query: string) {
    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    const pineconeIndex = await initPinecone();

    interface vectorStoreInterface extends Record<string, any> {
        asRetriever: Function;
    }
    
    const vectorStore: vectorStoreInterface = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    const retriever = vectorStore.asRetriever({
        k: 5,
        searchType: "similarity",
    });

    return retriever;
}

createRetriever("What are mitochondria made of?").then(res => (console.log(res)));