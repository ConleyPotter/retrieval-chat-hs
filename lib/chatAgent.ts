import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import createRetriever from "./retriever";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

export default async function callOnChatAgent(query: string): Promise<string> {
    const retriever = await createRetriever("What are mitochondria made of?");

    const llm = new ChatOpenAI({
        apiKey: process.env.OPENAI_API,
    });

    const multiRetriever = MultiQueryRetriever.fromLLM({
        llm,
        retriever,
    });

    const template = `Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        Use three sentences maximum and keep the answer as concise as possible.
        Always say "thanks for asking!" at the end of the answer.

        {context}

        Question: {question}

        Helpful Answer:`;

    const customRagPrompt = PromptTemplate.fromTemplate(template);

    const ragChain = await createStuffDocumentsChain({
        llm,
        prompt: customRagPrompt,
        outputParser: new StringOutputParser(),
    });
    const context = await multiRetriever.invoke(query);

    return await ragChain.invoke({
        question: query,
        context,
    });
}