import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Inside the PDF handler");
    // Enter your code here
    /** STEP ONE: LOAD DOCUMENT */
    const bookPath = `${process.cwd()}/public/documents/bitcoin.pdf`;

    const loader = new PDFLoader(bookPath);

    const docs = await loader.load();

    if (docs.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Chunk it

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunckOverlap: 10,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    // console.log(splitDocs.length);
    // Reduce the size of the metadata

    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf;
      return new Document({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });

    // console.log(reducedDocs.length);

    /** STEP TWO: UPLOAD TO DATABASE */
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

    // upload documents to Pinecone
    await PineconeStore.fromDocuments(reducedDocs, new OpenAIEmbeddings(), {
      pineconeIndex,
    });

    console.log("successfully uploaded");

    return res.status(200).json({ result: reducedDocs });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
