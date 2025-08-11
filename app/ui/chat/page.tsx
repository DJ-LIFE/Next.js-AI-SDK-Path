"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };
  return (
    <div className="flex flex-col w-full h-screen mx-auto p-4">
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 mb-20 overflow-y-auto border border-neutral-500 rounded-xl">
        {error && (
          <div className="text-red-500 mb-4 text-sm">
            Error: {error.message}
          </div>
        )}
        {status === "submitted" ||
          (status === "streaming" && <div>Loading...</div>)}
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="font-bold mb-2">
              {message.role === "user" ? "You:" : "AI:"}
            </div>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <div
                      key={`${message.id} - ${index}`}
                      className="whitespace-pre-wrap"
                    >
                      {part.text}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
      <form
        className="flex gap-2 fixed bottom-10 w-full p-2"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto">
          <input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="flex-1 dark:bg-zinc-800 p-2 pl-4 border-zinc-300 dark:border-zinc-100 rounded-l-lg"
          />
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="cursor-pointer py-2 px-4 bg-red-500 text-white rounded-r-lg"
            >
              Stop
            </button>
          ) : (
            <button
              disabled={status !== "ready"}
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-r-lg"
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
