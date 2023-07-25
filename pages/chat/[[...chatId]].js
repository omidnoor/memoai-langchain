import Head from "next/head";
import { useEffect, useState } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import Message from "components/Message/Message";
import { useRouter } from "next/router";
import { ChatSidebar } from "components/ChatSidebar";
import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import { BsRobot } from "react-icons/bs";
import PdfUpLoaderCS from "components/PdfUpLoader/PdfUpLoaderCS";

export default function ChatPage({ chatId, title, messages = [] }) {
  const [messageText, setMessageText] = useState("");
  const [incomingMessage, setIncomingMessage] = useState("");
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [newChatId, setNewChatId] = useState(null);
  const [fullMessage, setFullMessage] = useState("");
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const [firstMsg, setFirstMsg] = useState(true);
  const [source, setSource] = useState(null);
  const router = useRouter();

  const routeHasChanged = chatId !== originalChatId;

  const processToken = (token) => {
    return token.replace(/\\n/g, "\n").replace(/\"/g, "");
  };

  // when our route changes
  useEffect(() => {
    setNewChatMessages("");
    setNewChatId(null);
  }, [chatId]);

  // save newly streamed messages to new chat messages
  useEffect(() => {
    if (!routeHasChanged && !generatingResponse && fullMessage) {
      setNewChatMessages((prev) => [
        ...prev,
        {
          _id: uuid(),
          role: "assistant",
          content: fullMessage,
        },
      ]);
      setFullMessage("");
    }
  }, [generatingResponse, fullMessage, routeHasChanged]);

  // if we have created new chat
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [newChatId, generatingResponse, router]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setGeneratingResponse(true);
      setOriginalChatId(chatId);
      setNewChatMessages((prev) => {
        const newChatMessages = [
          ...prev,
          {
            _id: uuid(),
            role: "user",
            content: messageText,
          },
        ];
        return newChatMessages;
      });
      setMessageText("");
      const response = await fetch("/api/langChain/memory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message: messageText,
          firstMsg,
        }),
      });
      if (source) {
        source.close();
      }

      const newSource = new EventSource("/api/langChain/memory");
      setSource(newSource);

      newSource.addEventListener("newToken", (e) => {
        const token = processToken(e.data);
        setIncomingMessage((prev) => prev + token);
      });

      newSource.addEventListener("end", () => {
        newSource.close();
      });

      if (!response.ok) throw new Error("Something went wrong!");
      const data = await response.json();
      if (!data) return;
      // const reader = data.getReader();
      let content = "";
      setIncomingMessage(data.content.response);
      // content = content + data.content;
      console.log();
      setFullMessage(data.content.response);
      setGeneratingResponse(false);
      setFirstMsg(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [source]);

  const allMessages = [...messages, ...newChatMessages];

  return (
    <>
      <Head>
        <title>New ChatGPT</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar chatId={chatId} />
        <div className="flex flex-col overflow-hidden bg-gray-700">
          <div className="flex flex-1 flex-col-reverse overflow-auto text-white">
            {!allMessages.length && !incomingMessage && (
              <div className="m-auto flex flex-col items-center justify-center gap-1 text-center">
                <BsRobot size={70} className="p-1 text-emerald-200" />
                <h1 className="text-4xl font-bold text-white/50">
                  Ask me a quetion!
                </h1>
              </div>
            )}
            {!!allMessages.length && (
              <div className="mb-auto">
                {allMessages?.map((message, index) => (
                  <Message
                    key={message._id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {/* {!!incomingMessage && !routeHasChanged && (
                  <Message role="assistant" content={incomingMessage} />
                )} */}
                {!!incomingMessage && !!routeHasChanged && (
                  <Message
                    role="notice"
                    content="Wait! Only one message at a time. Please allow anymother responses to complete before sending another message!"
                  />
                )}
              </div>
            )}
          </div>
          <footer className=" bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline-emerald-500"
                />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
            <PdfUpLoaderCS />
          </footer>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.chatId?.[0] || null;

  if (chatId) {
    let objectId;
    try {
      objectId = new ObjectId(chatId);
    } catch (error) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }
    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("memoai");
    const chat = await db.collection("chats").findOne({
      userId: user.sub,
      _id: objectId,
    });

    if (!chat) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }

    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          _id: uuid(),
        })),
      },
    };
  }

  return {
    props: {},
  };
};
