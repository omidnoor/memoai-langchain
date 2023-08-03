import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed");
    }

    console.log("Query PDF");

    // Grab the user prompt
    const { message } = req.body;

    if (!message) {
      throw new Error("No message");
    }

    console.log("message received:", message);

    /* Use as part of a chain (currently no metadata filters) */

    // Initialize Pinecone
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    // Search!
    const model = new OpenAI();

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      {
        pineconeIndex,
      }
    );

    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 1,
      returnSourceDocuments: true,
    });

    const response = await chain.call({ query: message });

    return res.status(200).json({ content: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}