// /pages/api/transcript.js
import { YoutubeTranscript } from "youtube-transcript";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain";
import path from "path";

// Global variables
let chain;
let chatHistory = [];

// DO THIS SECOND
const initializeChain = async (initialPrompt, transcript, directory) => {
  try {
    const model = new ChatOpenAI({
      temperature: 0.75,
      modelName: "gpt-3.5-turbo",
    });

    // HNSWLib
    const vectorStore = await HNSWLib.fromDocuments(
      [
        {
          pageContent: transcript,
        },
      ],
      new OpenAIEmbeddings()
    );

    await vectorStore.save(directory);
    console.log(directory);
    const loadVectorStore = await HNSWLib.load(
      directory,
      new OpenAIEmbeddings()
    );

    console.log({ chatHistory });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message, firstMsg } = req.body;

    // console.log(message, firstMsg);
    // Then if it's the first message, we want to initialize the chain, since it doesn't exist yet
    if (firstMsg) {
      try {
        const initialMessage = `Give me asummary of the trascript: ${message}`;

        chatHistory.push({
          role: "user",
          message: initialMessage,
        });

        // Youtube transcript api
        const transcriptResponse = await YoutubeTranscript.fetchTranscript(
          message
        );
        if (!transcriptResponse) {
          return res.status(400).json({ error: "No transcript found" });
        }

        let transcript = "";
        transcriptResponse.forEach((line) => {
          transcript += line.text;
        });

        // console.log(transcript);
        const directory = path.join(process.cwd(), "documents");
        const response = await initializeChain(
          initialMessage,
          transcript,
          directory
        );
        // And then we'll jsut get the response back and the chatHistory
        return res.status(200).json({ content: response, chatHistory });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching transcript" });
      }

      // do this third!
    } else {
      // If it's not the first message, we can chat with the bot

      try {
        return res.status(200).json({ output: response, chatHistory });
      } catch (error) {
        // Generic error handling
        console.error(error);
        res
          .status(500)
          .json({ error: "An error occurred during the conversation." });
      }
    }
  }
}
