"use client";

import {
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Bot,
    RotateCcw,
    Send,
    Sparkles,
    X,
} from "lucide-react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const CLYDE_IMAGE = "/chatbot/clyde.webp";

const suggestions = [
    "What are your main skills?",
    "Tell me about your projects",
    "What can you build?",
    "Why should I hire you?",
];

const welcomeMessage: Message = {
    id: "welcome",
    role: "assistant",
    content:
        "Hi! I'm the portfolio assistant. Ask me about Flunco's skills, projects, experience, or what he can build for your business.",
};

export default function PortfolioChatbot() {
    const [open, setOpen] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        welcomeMessage,
    ]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    /*
     * Automatically scroll to the newest message.
     */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    /*
     * Send message to the API.
     */
    async function sendMessage(customMessage?: string) {
        const text =
            customMessage !== undefined
                ? customMessage.trim()
                : input.trim();

        if (!text || loading) {
            return;
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        /*
         * Keep the history before adding the new
         * user message. This prevents the current
         * message from being duplicated in history.
         */
        const history = messages;

        setMessages((current) => [
            ...current,
            userMessage,
        ]);

        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    history: history.map(
                        ({ role, content }) => ({
                            role,
                            content,
                        }),
                    ),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Request failed",
                );
            }

            const answer =
                typeof data.answer === "string"
                    ? data.answer
                    : "I couldn't generate an answer right now.";

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: answer,
                },
            ]);
        } catch (error) {
            console.error("Chat error:", error);

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content:
                        "Sorry, I couldn't answer that right now. Please try again or contact Flunco directly.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    /*
     * Clear conversation.
     */
    function clearChat() {
        if (loading) {
            return;
        }

        setMessages([
            {
                ...welcomeMessage,
                id: crypto.randomUUID(),
            },
        ]);

        setInput("");
    }

    /*
     * Submit input form.
     */
    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        void sendMessage();
    }

    return (
        <>
            {/* =====================================================
                CHATBOT LAUNCHER
            ====================================================== */}

            {!open && (
                <div
                    className="
                        fixed
                        bottom-6
                        right-6
                        z-[99999]
                    "
                >
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="
                            group
                            relative
                            h-24
                            w-24
                            rounded-full
                            bg-white
                            p-1
                            shadow-2xl
                            transition-all
                            duration-300
                            hover:scale-110
                            hover:shadow-sky-400/40
                            active:scale-95
                            focus:outline-none
                            focus:ring-4
                            focus:ring-sky-400/30

                            sm:h-28
                            sm:w-28

                            lg:h-32
                            lg:w-32
                        "
                        aria-label="Open portfolio assistant"
                    >
                        {/* =========================================
                            CLYDE IMAGE
                        ========================================== */}

                        <div
                            className="
                                relative
                                h-full
                                w-full
                                overflow-hidden
                                rounded-full
                                bg-slate-100
                            "
                        >
                            <img
                                src={CLYDE_IMAGE}
                                alt="Portfolio AI assistant"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    transition-transform
                                    duration-500
                                    group-hover:scale-105
                                "
                            />

                            {/* subtle shine */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-0
                                    rounded-full
                                    bg-gradient-to-br
                                    from-white/30
                                    via-transparent
                                    to-slate-900/10
                                "
                            />
                        </div>

                        {/* =========================================
                            AI BADGE
                        ========================================== */}

                        <span
                            className="
                                absolute
                                -right-1
                                -top-1
                                z-[100]
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border-4
                                border-white
                                bg-emerald-500
                                text-[10px]
                                font-black
                                tracking-tight
                                text-white
                                shadow-lg
                                shadow-emerald-500/30

                                sm:h-10
                                sm:w-10
                                sm:text-[11px]
                            "
                        >
                            AI
                        </span>

                        {/* =========================================
                            ONLINE DOT
                        ========================================== */}

                        <span
                            className="
                                absolute
                                bottom-2
                                right-2
                                z-[100]
                                h-4
                                w-4
                                rounded-full
                                border-2
                                border-white
                                bg-emerald-500
                                shadow-md
                            "
                            aria-label="Online"
                        />

                        {/* =========================================
                            HOVER LABEL
                        ========================================== */}

                        <span
                            className="
                                pointer-events-none
                                absolute
                                right-[calc(100%+14px)]
                                top-1/2
                                z-[100]
                                hidden
                                -translate-y-1/2
                                whitespace-nowrap
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-700
                                opacity-0
                                shadow-xl
                                transition-all
                                duration-200

                                lg:block
                                lg:group-hover:translate-x-1
                                lg:group-hover:opacity-100
                            "
                        >
                            Ask my AI assistant
                        </span>
                    </button>
                </div>
            )}

            {/* =====================================================
                CHAT WINDOW
            ====================================================== */}

            {open && (
                <div
                    className="
                        fixed
                        bottom-4
                        right-4
                        z-[99999]

                        flex
                        h-[calc(100vh-2rem)]
                        max-h-[720px]
                        w-[calc(100vw-2rem)]
                        max-w-[420px]
                        flex-col
                        overflow-hidden
                        rounded-[28px]
                        border
                        border-slate-200
                        bg-white
                        shadow-2xl
                        shadow-slate-950/20

                        sm:bottom-6
                        sm:right-6
                        sm:h-[650px]
                    "
                >
                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <header
                        className="
                            relative
                            flex
                            shrink-0
                            items-center
                            justify-between
                            overflow-hidden
                            bg-slate-950
                            px-5
                            py-4
                            text-white
                        "
                    >
                        {/* Decorative glow */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-10
                                -top-10
                                h-32
                                w-32
                                rounded-full
                                bg-sky-500/20
                                blur-3xl
                            "
                        />

                        <div className="relative flex items-center gap-3">
                            {/* Small Clyde avatar */}

                            <div
                                className="
                                    relative
                                    h-11
                                    w-11
                                    overflow-hidden
                                    rounded-full
                                    border-2
                                    border-white/20
                                    bg-white
                                "
                            >
                                <img
                                    src={CLYDE_IMAGE}
                                    alt="AI assistant"
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />

                                <span
                                    className="
                                        absolute
                                        bottom-0
                                        right-0
                                        h-3
                                        w-3
                                        rounded-full
                                        border-2
                                        border-white
                                        bg-emerald-400
                                    "
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">
                                        Portfolio Assistant
                                    </p>

                                    <Sparkles className="h-4 w-4 text-sky-400" />
                                </div>

                                <p className="mt-0.5 text-xs text-slate-400">
                                    Ask me about Flunco
                                </p>
                            </div>
                        </div>

                        {/* Header buttons */}

                        <div className="relative flex items-center gap-1">
                            <button
                                type="button"
                                onClick={clearChat}
                                disabled={loading}
                                className="
                                    rounded-xl
                                    p-2
                                    text-slate-400
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                                aria-label="Clear conversation"
                                title="Clear conversation"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="
                                    rounded-xl
                                    p-2
                                    text-slate-400
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                "
                                aria-label="Close chatbot"
                                title="Close chatbot"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </header>

                    {/* =================================================
                        MESSAGES
                    ================================================== */}

                    <div
                        className="
                            flex-1
                            space-y-4
                            overflow-y-auto
                            bg-slate-50
                            px-4
                            py-5
                            overscroll-contain
                        "
                    >
                        {messages.map((message) => {
                            const isUser =
                                message.role === "user";

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        isUser
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {!isUser && (
                                        <div
                                            className="
                                                mr-2
                                                mt-1
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                overflow-hidden
                                                rounded-full
                                                bg-white
                                                shadow-sm
                                            "
                                        >
                                            <img
                                                src={CLYDE_IMAGE}
                                                alt=""
                                                className="
                                                    h-full
                                                    w-full
                                                    object-cover
                                                "
                                            />
                                        </div>
                                    )}

                                    <div
                                        className={`
                                            max-w-[82%]
                                            rounded-2xl
                                            px-4
                                            py-3
                                            text-sm
                                            leading-6
                                            ${
                                                isUser
                                                    ? `
                                                        rounded-br-md
                                                        bg-sky-500
                                                        text-white
                                                        shadow-sm
                                                    `
                                                    : `
                                                        rounded-bl-md
                                                        border
                                                        border-slate-200
                                                        bg-white
                                                        text-slate-700
                                                        shadow-sm
                                                    `
                                            }
                                        `}
                                    >
                                        <p className="whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* =============================================
                            LOADING
                        ============================================== */}

                        {loading && (
                            <div className="flex justify-start">
                                <div
                                    className="
                                        mr-2
                                        mt-1
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        overflow-hidden
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                    "
                                >
                                    <img
                                        src={CLYDE_IMAGE}
                                        alt=""
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />
                                </div>

                                <div
                                    className="
                                        rounded-2xl
                                        rounded-bl-md
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-3
                                        shadow-sm
                                    "
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />

                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                animate-bounce
                                                rounded-full
                                                bg-slate-400
                                                [animation-delay:120ms]
                                            "
                                        />

                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                animate-bounce
                                                rounded-full
                                                bg-slate-400
                                                [animation-delay:240ms]
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* =================================================
                        SUGGESTIONS
                    ================================================== */}

                    {messages.length === 1 && !loading && (
                        <div
                            className="
                                shrink-0
                                border-t
                                border-slate-100
                                bg-white
                                px-4
                                py-3
                            "
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <Sparkles className="h-3.5 w-3.5 text-sky-500" />

                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Try asking
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {suggestions.map(
                                    (suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() =>
                                                void sendMessage(
                                                    suggestion,
                                                )
                                            }
                                            className="
                                                rounded-full
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                px-3
                                                py-2
                                                text-left
                                                text-xs
                                                font-medium
                                                text-slate-600
                                                transition
                                                hover:border-sky-300
                                                hover:bg-sky-50
                                                hover:text-sky-600
                                            "
                                        >
                                            {suggestion}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        INPUT
                    ================================================== */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                            flex
                            shrink-0
                            gap-2
                            border-t
                            border-slate-200
                            bg-white
                            p-3
                        "
                    >
                        <input
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            disabled={loading}
                            maxLength={1000}
                            placeholder="Ask about my skills..."
                            className="
                                min-w-0
                                flex-1
                                rounded-2xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-sky-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-sky-400/10
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        />

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !input.trim()
                            }
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-sky-500
                                text-white
                                shadow-lg
                                shadow-sky-500/20
                                transition-all
                                hover:bg-sky-400
                                hover:shadow-sky-500/30
                                active:scale-95
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                disabled:shadow-none
                            "
                            aria-label="Send message"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}