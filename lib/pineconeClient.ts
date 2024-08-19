// pineconeClient.ts
import { Index, Pinecone, RecordMetadata } from '@pinecone-database/pinecone';

const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
});

export default async function initPinecone(): Promise<Index<RecordMetadata>> {
    return pineconeClient.index(process.env.PINECONE_INDEX_NAME!);
}