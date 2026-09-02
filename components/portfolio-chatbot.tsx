"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  X,
  RotateCcw,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What are your main skills?",
  "Tell me about your projects",
  "What can you build?",
  "Tell me about your experience",
];

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the portfolio assistant. Ask me about Flunco's skills, projects, experience, or what he can build for your business.",
};

export default function PortfolioChatbot() {
  const [open, setOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      welcomeMessage,
    ]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(
    customMessage?: string,
  ) {
    const text =
      customMessage ??
      input.trim();

    if (!text || loading) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const history = messages;

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response =
        await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: text,
            history:
              history.map(
                ({
                  role,
                  content,
                }) => ({
                  role,
                  content,
                }),
              ),
          }),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Request failed",
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn't answer that right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        ...welcomeMessage,
        id: crypto.randomUUID(),
      },
    ]);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    sendMessage();
  }

  return (
    <>
      {/* Floating launcher */}

      {!open && (
        <button
          type="button"
          onClick={() =>
            setOpen(true)
          }
          aria-label="Open portfolio AI"
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            items-center
            gap-2
            rounded-full
            border
            border-sky-200
            bg-white
            px-3
            py-2
            shadow-lg
            transition
            hover:-translate-y-0.5
            hover:shadow-xl
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-sky-100
              text-sky-600
            "
          >
            <Sparkles size={17} />
          </span>

          <span
            className="
              pr-2
              text-xs
              font-semibold
              text-slate-800
            "
          >
            Ask about me
          </span>
        </button>
      )}

      {/* Chat window */}

      {open && (
        <section
          className="
            fixed
            bottom-5
            right-5
            z-50
            flex
            h-[min(680px,calc(100vh-40px))]
            w-[min(410px,calc(100vw-40px))]
            flex-col
            overflow-hidden
            rounded-[24px]
            border
            border-slate-200
            bg-white
            shadow-2xl
          "
        >
          {/* Header */}

          <header
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-100
              px-5
              py-4
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-sky-100
                  text-sky-600
                "
              >
                <Bot size={20} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className="
                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    Portfolio AI
                  </h2>

                  <span
                    className="
                      rounded-full
                      bg-emerald-50
                      px-2
                      py-0.5
                      text-[9px]
                      font-semibold
                      text-emerald-600
                    "
                  >
                    ONLINE
                  </span>
                </div>

                <p
                  className="
                    text-[11px]
                    text-slate-400
                  "
                >
                  Ask about my work
                  & skills
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  hover:bg-slate-50
                  hover:text-slate-700
                "
                aria-label="Clear chat"
              >
                <RotateCcw
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  rounded-lg
                  p-2
                  text-slate-400
                  hover:bg-slate-50
                  hover:text-slate-700
                "
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Messages */}

          <div
            className="
              flex-1
              overflow-y-auto
              bg-slate-50/70
              px-4
              py-5
            "
          >
            <div className="space-y-4">
              {messages.map(
                (message) => {
                  const user =
                    message.role ===
                    "user";

                  return (
                    <div
                      key={
                        message.id
                      }
                      className={
                        user
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >
                      <div
                        className={
                          user
                            ? `
                              max-w-[82%]
                              rounded-2xl
                              rounded-br-md
                              bg-sky-500
                              px-4
                              py-3
                              text-sm
                              leading-6
                              text-white
                            `
                            : `
                              max-w-[88%]
                              rounded-2xl
                              rounded-bl-md
                              border
                              border-slate-200
                              bg-white
                              px-4
                              py-3
                              text-sm
                              leading-6
                              text-slate-700
                              shadow-sm
                            `
                        }
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                },
              )}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="
                      rounded-2xl
                      rounded-bl-md
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-slate-400
                    "
                  >
                    <span className="animate-pulse">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}

              <div
                ref={bottomRef}
              />
            </div>
          </div>

          {/* Suggestions */}

          {messages.length ===
            1 && (
            <div
              className="
                border-t
                border-slate-100
                bg-white
                px-4
                pt-3
              "
            >
              <div
                className="
                  flex
                  gap-2
                  overflow-x-auto
                  pb-2
                "
              >
                {suggestions.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        sendMessage(
                          item,
                        )
                      }
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-sky-100
                        bg-sky-50
                        px-3
                        py-2
                        text-[11px]
                        text-sky-700
                        hover:bg-sky-100
                      "
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Input */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              flex
              items-center
              gap-2
              border-t
              border-slate-100
              bg-white
              p-3
            "
          >
            <div
              className="
                flex
                flex-1
                items-center
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-3
              "
            >
              <MessageCircle
                size={16}
                className="
                  mr-2
                  shrink-0
                  text-slate-400
                "
              />

              <input
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target
                      .value,
                  )
                }
                disabled={loading}
                placeholder="Ask me something..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  py-3
                  text-sm
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                "
              />
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !input.trim()
              }
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-sky-500
                text-white
                transition
                hover:bg-sky-600
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}