import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import SSE from "express-sse";

let model;
let memory;
let chain;

const sse = new SSE();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { message, firstMsg, chatId } = req.body;
      if (!message) {
        throw new Error("Invalid input");
      }
      if (firstMsg) {
        console.log("init chain");
        model = new OpenAI({
          modelName: "gpt-3.5-turbo",
          streaming: true,
          callbacks: [
            {
              handleLLMNewToken(token) {
                sse.send(token, "newToken");
              },
            },
          ],
        });
        memory = new BufferMemory();
        chain = new ConversationChain({
          llm: model,
          memory: memory,
        });
      }
      const response = await chain.call({ input: message }, [
        {
          handleLLMNewToken(token) {
            process.stdout.write(token);
          },
        },
      ]);
      console.log(response);
      return res.status(200).json({ content: response });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    return;
  }
}
