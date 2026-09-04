"use client";

import {
    FormEvent,
    KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
    Bot,
    Check,
    Copy,
    RotateCcw,
    Send,
    Sparkles,
    ThumbsDown,
    ThumbsUp,
    X,
} from "lucide-react";

import { useChatbotStore } from "@/lib/chatbot-store";

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type MessageRole = "user" | "assistant";

type Message = {
    id: string;
    role: MessageRole;
    content: string;
    error?: boolean;
};

type ChatHistoryItem = {
    role: MessageRole;
    content: string;
};

type FeedbackValue = "up" | "down";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const CLYDE_IMAGE =
    "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6707a0ea5ddb44cae1dd6b29_clyde_pose_02%201.webp";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 20;

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
        "Hi! I'm the portfolio assistant. Ask me about Frunco's skills, projects, experience, or what he can build for your business.",
};

/*
|--------------------------------------------------------------------------
| Animation
|--------------------------------------------------------------------------
*/

const launcherTransition = {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
};

const messageTransition = {
    duration: 0.28,
    ease: [0.16, 1, 0.3, 1] as const,
};

/*
|--------------------------------------------------------------------------
| Bot Avatar
|--------------------------------------------------------------------------
*/

function BotAvatar({
    size = "md",
    showOnline = false,
}: {
    size?: "sm" | "md" | "lg";
    showOnline?: boolean;
}) {
    const sizeClass =
        size === "sm"
            ? "h-8 w-8"
            : size === "lg"
              ? "h-14 w-14"
              : "h-11 w-11";

    return (
        <div
            className={`relative shrink-0 overflow-hidden rounded-full ${sizeClass}`}
        >
            <img
                src={CLYDE_IMAGE}
                alt="Portfolio AI assistant"
                className="h-full w-full object-contain"
                loading="eager"
                draggable={false}
            />

            {showOnline && (
                <span
                    className="
                        absolute
                        bottom-0.5
                        right-0.5
                        h-3
                        w-3
                        rounded-full
                        border-2
                        border-white
                        bg-emerald-400
                        shadow-sm
                    "
                    aria-label="Online"
                />
            )}
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Typing Indicator
|--------------------------------------------------------------------------
*/

function TypingIndicator() {
    return (
        <div
            className="flex items-end gap-2"
            aria-live="polite"
            aria-label="Assistant is typing"
        >
            <BotAvatar size="sm" />

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
                    {[0, 120, 240].map((delay) => (
                        <motion.span
                            key={delay}
                            animate={{
                                y: [0, -3, 0],
                                opacity: [0.45, 1, 0.45],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: delay / 1000,
                            }}
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-slate-400
                            "
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Inline Assistant Text Renderer
|--------------------------------------------------------------------------
|
| Supports:
| - **bold**
| - URLs
|--------------------------------------------------------------------------
*/

function renderInlineText(text: string) {
    const parts = text.split(
        /(https?:\/\/[^\s]+|\*\*[^*]+\*\*)/g,
    );

    return parts.map((part, index) => {
        if (
            part.startsWith("http://") ||
            part.startsWith("https://")
        ) {
            const cleanUrl = part.replace(
                /[),.!?]+$/,
                "",
            );

            return (
                <a
                    key={index}
                    href={cleanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        font-medium
                        text-sky-500
                        underline
                        underline-offset-2
                        transition-colors
                        hover:text-sky-600
                    "
                >
                    {cleanUrl}
                </a>
            );
        }

        if (
            part.startsWith("**") &&
            part.endsWith("**") &&
            part.length >= 4
        ) {
            return (
                <strong
                    key={index}
                    className="font-semibold text-slate-900"
                >
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return (
            <span key={index}>
                {part}
            </span>
        );
    });
}

/*
|--------------------------------------------------------------------------
| Assistant Message Renderer
|--------------------------------------------------------------------------
*/

function renderAssistantContent(content: string) {
    const lines = content.split("\n");

    return lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
            return (
                <div
                    key={`space-${index}`}
                    className="h-2"
                    aria-hidden="true"
                />
            );
        }

        /*
         * Markdown bullet
         */
        if (
            trimmed.startsWith("- ") ||
            trimmed.startsWith("* ")
        ) {
            const text = trimmed.slice(2);

            return (
                <div
                    key={index}
                    className="flex gap-2"
                >
                    <span
                        className="
                            mt-2
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-sky-400
                        "
                    />

                    <span>
                        {renderInlineText(text)}
                    </span>
                </div>
            );
        }

        /*
         * Numbered list
         */
        const numberedMatch =
            trimmed.match(/^(\d+)\.\s+(.*)$/);

        if (numberedMatch) {
            return (
                <div
                    key={index}
                    className="flex gap-2"
                >
                    <span
                        className="
                            shrink-0
                            font-semibold
                            text-sky-500
                        "
                    >
                        {numberedMatch[1]}.
                    </span>

                    <span>
                        {renderInlineText(
                            numberedMatch[2],
                        )}
                    </span>
                </div>
            );
        }

        /*
         * Heading
         */
        if (trimmed.startsWith("### ")) {
            return (
                <p
                    key={index}
                    className="
                        mt-2
                        font-bold
                        text-slate-900
                    "
                >
                    {renderInlineText(
                        trimmed.slice(4),
                    )}
                </p>
            );
        }

        /*
         * Normal paragraph
         */
        return (
            <p key={index}>
                {renderInlineText(trimmed)}
            </p>
        );
    });
}

/*
|--------------------------------------------------------------------------
| Main Chatbot
|--------------------------------------------------------------------------
*/

export default function PortfolioChatbot() {
    const open = useChatbotStore((state) => state.isOpen);
    const openChat = useChatbotStore((state) => state.openChat);
    const closeChat = useChatbotStore((state) => state.closeChat);

    const [messages, setMessages] = useState<Message[]>([
        welcomeMessage,
    ]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const [copiedId, setCopiedId] =
        useState<string | null>(null);

    const [feedback, setFeedback] = useState<Record<string, FeedbackValue>>({});
    const [feedbackReason, setFeedbackReason] = useState<Record<string, string>>({});
    const [feedbackComment, setFeedbackComment] = useState<Record<string, string>>({});
    const [feedbackSubmitting, setFeedbackSubmitting] = useState<string | null>(null);

    const inputRef =
        useRef<HTMLTextAreaElement>(null);

    const bottomRef =
        useRef<HTMLDivElement>(null);

    /*
    |--------------------------------------------------------------------------
    | Scroll to newest message
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages, loading]);

    /*
    |--------------------------------------------------------------------------
    | Focus input when chatbot opens
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!open) {
            return;
        }

        const timer = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 250);

        return () => {
            window.clearTimeout(timer);
        };
    }, [open]);

    /*
    |--------------------------------------------------------------------------
    | Escape closes chatbot
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleEscape(event: globalThis.KeyboardEvent) {
            if (
                event.key === "Escape" &&
                !loading
            ) {
                closeChat();
            }
        }

        window.addEventListener(
            "keydown",
            handleEscape,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleEscape,
            );
        };
    }, [open, loading]);

    /*
    |--------------------------------------------------------------------------
    | Lock background scrolling on mobile
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            !open ||
            window.innerWidth >= 640
        ) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [open]);

    /*
    |--------------------------------------------------------------------------
    | Build API history
    |--------------------------------------------------------------------------
    */

    const buildHistory = useCallback(
        (
            sourceMessages: Message[],
        ): ChatHistoryItem[] => {
            return sourceMessages
                .filter(
                    (message) =>
                        !message.error,
                )
                .slice(-MAX_HISTORY_MESSAGES)
                .map(
                    ({
                        role,
                        content,
                    }) => ({
                        role,
                        content,
                    }),
                );
        },
        [],
    );

    /*
    |--------------------------------------------------------------------------
    | Send message
    |--------------------------------------------------------------------------
    */

    async function sendMessage(
        customMessage?: string,
        historyOverride?: Message[],
    ) {
        const text =
            customMessage !== undefined
                ? customMessage.trim()
                : input.trim();

        if (!text || loading) {
            return;
        }

        const safeText = text.slice(
            0,
            MAX_MESSAGE_LENGTH,
        );

        const historySource =
            historyOverride ?? messages;

        const history =
            buildHistory(historySource);

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: safeText,
        };

        setMessages((current) => [
            ...current,
            userMessage,
        ]);

        setInput("");

        /*
         * Reset textarea height after sending.
         */
        if (inputRef.current) {
            inputRef.current.style.height =
                "48px";
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        message: safeText,
                        history,
                    }),
                },
            );

            let data: {
                answer?: unknown;
                error?: unknown;
            } = {};

            try {
                data =
                    await response.json();
            } catch {
                data = {};
            }

            if (!response.ok) {
                throw new Error(
                    typeof data.error ===
                        "string"
                        ? data.error
                        : "Request failed.",
                );
            }

            const answer =
                typeof data.answer ===
                "string"
                    ? data.answer.trim()
                    : "";

            if (!answer) {
                throw new Error(
                    "The assistant returned an empty response.",
                );
            }

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: answer,
                },
            ]);
        } catch (error) {
            console.error(
                "Portfolio chatbot error:",
                error,
            );

            setMessages((current) => [
                ...current,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    error: true,
                    content:
                        "Sorry, I couldn't answer that right now. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);

            window.setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Clear conversation
    |--------------------------------------------------------------------------
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

        setCopiedId(null);

        setFeedback({});
        setFeedbackReason({});
        setFeedbackComment({});

        if (inputRef.current) {
            inputRef.current.style.height =
                "48px";
        }

        window.setTimeout(() => {
            inputRef.current?.focus();
        }, 50);
    }

    /*
    |--------------------------------------------------------------------------
    | Retry failed request
    |--------------------------------------------------------------------------
    |
    | Important:
    | We construct the exact history BEFORE the failed assistant message,
    | rather than relying on a state update followed immediately by sendMessage.
    |--------------------------------------------------------------------------
    */

    function retryLastMessage(
        errorMessageId: string,
    ) {
        if (loading) {
            return;
        }

        const errorIndex =
            messages.findIndex(
                (message) =>
                    message.id ===
                    errorMessageId &&
                    message.error,
            );

        if (errorIndex === -1) {
            return;
        }

        const previousMessages =
            messages.slice(
                0,
                errorIndex,
            );

        const lastUserMessage =
            [...previousMessages]
                .reverse()
                .find(
                    (message) =>
                        message.role ===
                        "user",
                );

        if (!lastUserMessage) {
            return;
        }

        /*
         * Remove the failed assistant response.
         */
        setMessages(previousMessages);

        /*
         * Send using the exact previous conversation.
         */
        void sendMessage(
            lastUserMessage.content,
            previousMessages.slice(
                0,
                previousMessages.lastIndexOf(
                    lastUserMessage,
                ),
            ),
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Copy assistant response
    |--------------------------------------------------------------------------
    */

    async function copyMessage(
        message: Message,
    ) {
        if (message.error) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                message.content,
            );

            setCopiedId(message.id);

            window.setTimeout(() => {
                setCopiedId((current) =>
                    current === message.id
                        ? null
                        : current,
                );
            }, 1500);
        } catch (error) {
            console.error(
                "Copy failed:",
                error,
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Feedback
    |--------------------------------------------------------------------------
    */

    async function handleFeedback(
        messageId: string,
        value: FeedbackValue,
    ) {
        const current = feedback[messageId];

        if (current === value) {
            setFeedback((state) => {
                const next = { ...state };
                delete next[messageId];
                return next;
            });
            try {
                await fetch("/api/feedback", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messageId }),
                });
            } catch (error) {
                console.error("Feedback removal failed:", error);
            }
            return;
        }

        const index = messages.findIndex((message) => message.id === messageId);
        const message = messages[index];
        if (!message || message.role !== "assistant" || message.error) return;

        if (value === "down") {
            setFeedback((state) => ({ ...state, [messageId]: value }));
            return;
        }

        setFeedback((state) => ({ ...state, [messageId]: value }));
        setFeedbackSubmitting(messageId);
        try {
            const previousUser = [...messages.slice(0, index)].reverse().find((item) => item.role === "user");
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId,
                    value,
                    question: previousUser?.content || "",
                    answer: message.content,
                }),
            });
            if (!response.ok) throw new Error("Feedback request failed");
        } catch (error) {
            console.error("Feedback save failed:", error);
        } finally {
            setFeedbackSubmitting(null);
        }
    }

    async function submitNegativeFeedback(messageId: string) {
        const index = messages.findIndex((message) => message.id === messageId);
        const message = messages[index];
        if (!message || message.role !== "assistant" || message.error) return;

        setFeedbackSubmitting(messageId);
        try {
            const previousUser = [...messages.slice(0, index)].reverse().find((item) => item.role === "user");
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId,
                    value: "down",
                    reason: feedbackReason[messageId] || "other",
                    comment: feedbackComment[messageId] || "",
                    question: previousUser?.content || "",
                    answer: message.content,
                }),
            });
            if (!response.ok) throw new Error("Feedback request failed");
        } catch (error) {
            console.error("Negative feedback save failed:", error);
        } finally {
            setFeedbackSubmitting(null);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Submit form
    |--------------------------------------------------------------------------
    */

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        void sendMessage();
    }

    /*
    |--------------------------------------------------------------------------
    | Keyboard behavior
    |--------------------------------------------------------------------------
    |
    | Enter       -> send
    | Shift+Enter -> newline
    |--------------------------------------------------------------------------
    */

    function handleKeyDown(
        event: KeyboardEvent<HTMLTextAreaElement>,
    ) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            void sendMessage();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Auto-grow textarea
    |--------------------------------------------------------------------------
    */

    function handleInputChange(
        value: string,
    ) {
        const safeValue = value.slice(
            0,
            MAX_MESSAGE_LENGTH,
        );

        setInput(safeValue);

        const textarea =
            inputRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";

        textarea.style.height = `${Math.min(
            Math.max(
                textarea.scrollHeight,
                48,
            ),
            120,
        )}px`;
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            {/* =========================================================
                FLOATING LAUNCHER
            ========================================================== */}

            <AnimatePresence>
                {!open && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.7,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.7,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                        className="
                            fixed
                            bottom-5
                            right-5
                            z-[99999]

                            sm:bottom-6
                            sm:right-6
                        "
                    >
                        <motion.button
                            type="button"
                            onClick={openChat}
                            whileHover={{
                                scale: 1.06,
                            }}
                            whileTap={{
                                scale: 0.94,
                            }}
                            transition={
                                launcherTransition
                            }
                            className="
                                group
                                relative
                                flex
                                h-[76px]
                                w-[76px]
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white/80
                                bg-white
                                p-1
                                shadow-2xl
                                shadow-slate-950/20
                                outline-none
                                ring-sky-400/30
                                transition
                                focus:ring-4

                                sm:h-[84px]
                                sm:w-[84px]

                                lg:h-[92px]
                                lg:w-[92px]
                            "
                            aria-label="Open portfolio assistant"
                        >
                            {/* Ambient glow */}

                            <motion.div
                                animate={{
                                    scale: [
                                        1,
                                        1.08,
                                        1,
                                    ],
                                    opacity: [
                                        0.18,
                                        0.3,
                                        0.18,
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat:
                                        Infinity,
                                    ease: "easeInOut",
                                }}
                                className="
                                    pointer-events-none
                                    absolute
                                    -inset-3
                                    rounded-full
                                    bg-sky-400
                                    blur-2xl
                                "
                            />

                            {/* Avatar */}

                            <div
                                className="
                                    relative
                                    z-10
                                    h-full
                                    w-full
                                    overflow-hidden
                                    rounded-full
                                    bg-transparent
                                "
                            >
                                <img
                                    src={
                                        CLYDE_IMAGE
                                    }
                                    alt="Portfolio AI assistant"
                                    className="
                                        h-full
                                        w-full
                                        object-contain
                                        transition-transform
                                        duration-500
                                        group-hover:scale-105
                                    "
                                    draggable={false}
                                />
                            </div>

                            {/* AI badge */}

                            <span
                                className="
                                    absolute
                                    -right-1
                                    -top-1
                                    z-20
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    border-[3px]
                                    border-white
                                    bg-emerald-500
                                    text-[9px]
                                    font-black
                                    tracking-tight
                                    text-white
                                    shadow-lg
                                    shadow-emerald-500/30
                                "
                            >
                                AI
                            </span>

                            {/* Online indicator */}

                            <motion.span
                                animate={{
                                    boxShadow: [
                                        "0 0 0 0 rgba(16,185,129,0.35)",
                                        "0 0 0 5px rgba(16,185,129,0)",
                                    ],
                                }}
                                transition={{
                                    duration: 1.8,
                                    repeat:
                                        Infinity,
                                }}
                                className="
                                    absolute
                                    bottom-1.5
                                    right-1.5
                                    z-20
                                    h-4
                                    w-4
                                    rounded-full
                                    border-2
                                    border-white
                                    bg-emerald-500
                                "
                                aria-label="Online"
                            />

                            {/* Desktop hover label */}

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    right-[calc(100%+14px)]
                                    top-1/2
                                    z-30
                                    hidden
                                    -translate-y-1/2
                                    translate-x-2
                                    whitespace-nowrap
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    opacity-0
                                    shadow-xl
                                    transition-all
                                    duration-200

                                    lg:block
                                    lg:group-hover:translate-x-0
                                    lg:group-hover:opacity-100
                                "
                            >
                                Ask my AI assistant
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =========================================================
                CHAT WINDOW
            ========================================================== */}

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 24,
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: 24,
                            scale: 0.96,
                        }}
                        transition={{
                            duration: 0.28,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ],
                        }}
                        className="
                            fixed
                            inset-x-3
                            bottom-3
                            z-[99999]
                            flex
                            h-[calc(100dvh-1.5rem)]
                            max-h-[760px]
                            flex-col
                            overflow-hidden
                            rounded-[28px]
                            border
                            border-slate-200
                            bg-white
                            shadow-2xl
                            shadow-slate-950/25

                            sm:bottom-6
                            sm:left-auto
                            sm:right-6
                            sm:h-[650px]
                            sm:w-[420px]
                        "
                        role="dialog"
                        aria-modal="false"
                        aria-label="Portfolio Assistant"
                    >
                        {/* =================================================
                            HEADER
                        ================================================== */}

                        <header
                            className="
                                relative
                                shrink-0
                                overflow-hidden
                                bg-slate-950
                                px-5
                                py-4
                                text-white
                            "
                        >
                            {/* Header glow */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-16
                                    -top-20
                                    h-44
                                    w-44
                                    rounded-full
                                    bg-sky-500/20
                                    blur-3xl
                                "
                            />

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -bottom-24
                                    left-10
                                    h-32
                                    w-32
                                    rounded-full
                                    bg-indigo-500/10
                                    blur-3xl
                                "
                            />

                            <div className="relative flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    {/* Avatar */}

                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-full
                                            bg-white/[0.04]
                                            ring-1
                                            ring-white/15
                                        "
                                    >
                                        <BotAvatar
                                            size="md"
                                            showOnline
                                        />
                                    </div>

                                    {/* Title */}

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-bold">
                                                Portfolio Assistant
                                            </p>

                                            <Sparkles
                                                className="
                                                    h-3.5
                                                    w-3.5
                                                    shrink-0
                                                    text-sky-400
                                                "
                                            />
                                        </div>

                                        <div className="mt-1 flex items-center gap-1.5">
                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-emerald-400
                                                "
                                            />

                                            <p className="text-[11px] text-slate-400">
                                                Online · Ask me anything
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}

                                <div className="relative flex shrink-0 items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={
                                            clearChat
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="
                                            rounded-xl
                                            p-2
                                            text-slate-400
                                            transition
                                            hover:bg-white/10
                                            hover:text-white
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-sky-400/50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-30
                                        "
                                        aria-label="Clear conversation"
                                        title="Clear conversation"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeChat}
                                        disabled={
                                            loading
                                        }
                                        className="
                                            rounded-xl
                                            p-2
                                            text-slate-400
                                            transition
                                            hover:bg-white/10
                                            hover:text-white
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-sky-400/50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-30
                                        "
                                        aria-label="Close chatbot"
                                        title="Close chatbot"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* =================================================
                            MESSAGES
                        ================================================== */}

                        <div
                            className="
                                relative
                                flex-1
                                space-y-4
                                overflow-y-auto
                                overscroll-contain
                                bg-slate-50
                                px-4
                                py-5

                                [scrollbar-color:#cbd5e1_transparent]
                                [scrollbar-width:thin]
                            "
                            aria-live="polite"
                        >
                            {/* Welcome marker */}

                            {messages.length === 1 && (
                                <div className="mb-5 flex items-center justify-center">
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            border
                                            border-slate-200
                                            bg-white
                                            px-3
                                            py-1.5
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.15em]
                                            text-slate-400
                                            shadow-sm
                                        "
                                    >
                                        <Bot className="h-3 w-3 text-sky-500" />
                                        Portfolio AI
                                    </div>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {messages.map(
                                    (message) => {
                                        const isUser =
                                            message.role ===
                                            "user";

                                        const currentFeedback =
                                            feedback[
                                                message.id
                                            ];

                                        return (
                                            <motion.div
                                                key={
                                                    message.id
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                    scale: 0.98,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                transition={
                                                    messageTransition
                                                }
                                                className={`group flex ${
                                                    isUser
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                {/* Assistant avatar */}

                                                {!isUser && (
                                                    <div className="mr-2 mt-1">
                                                        <BotAvatar size="sm" />
                                                    </div>
                                                )}

                                                <div
                                                    className={`
                                                        max-w-[82%]
                                                        ${
                                                            !isUser &&
                                                            "flex flex-col"
                                                        }
                                                    `}
                                                >
                                                    {/* Message bubble */}

                                                    <div
                                                        className={`
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
                                                                        ${
                                                                            message.error
                                                                                ? "border-red-200"
                                                                                : "border-slate-200"
                                                                        }
                                                                        bg-white
                                                                        text-slate-700
                                                                        shadow-sm
                                                                    `
                                                            }
                                                        `}
                                                    >
                                                        {isUser ? (
                                                            <p className="whitespace-pre-wrap break-words">
                                                                {
                                                                    message.content
                                                                }
                                                            </p>
                                                        ) : (
                                                            <div
                                                                className="
                                                                    space-y-1
                                                                    break-words
                                                                "
                                                            >
                                                                {renderAssistantContent(
                                                                    message.content,
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Assistant actions */}

                                                    {!isUser && (
                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                items-center
                                                                gap-0.5
                                                                pl-1
                                                                opacity-0
                                                                transition-opacity
                                                                group-hover:opacity-100
                                                                group-focus-within:opacity-100
                                                            "
                                                        >
                                                            {/* Copy */}

                                                            {!message.error && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        void copyMessage(
                                                                            message,
                                                                        )
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        p-1.5
                                                                        text-slate-400
                                                                        transition
                                                                        hover:bg-white
                                                                        hover:text-slate-600
                                                                        focus:outline-none
                                                                        focus:ring-2
                                                                        focus:ring-sky-400/40
                                                                    "
                                                                    aria-label="Copy answer"
                                                                    title="Copy answer"
                                                                >
                                                                    {copiedId ===
                                                                    message.id ? (
                                                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                                                    ) : (
                                                                        <Copy className="h-3.5 w-3.5" />
                                                                    )}
                                                                </button>
                                                            )}

                                                            {/* Helpful */}

                                                            {!message.error && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        void handleFeedback(
                                                                            message.id,
                                                                            "up",
                                                                        )
                                                                    }
                                                                    className={`
                                                                        rounded-lg
                                                                        p-1.5
                                                                        transition
                                                                        focus:outline-none
                                                                        focus:ring-2
                                                                        focus:ring-sky-400/40
                                                                        ${
                                                                            currentFeedback ===
                                                                            "up"
                                                                                ? "bg-emerald-50 text-emerald-500"
                                                                                : "text-slate-400 hover:bg-white hover:text-slate-600"
                                                                        }
                                                                    `}
                                                                    aria-label="Helpful"
                                                                    title="Helpful"
                                                                    aria-pressed={
                                                                        currentFeedback ===
                                                                        "up"
                                                                    }
                                                                >
                                                                    <ThumbsUp className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}

                                                            {/* Not helpful */}

                                                            {!message.error && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        void handleFeedback(
                                                                            message.id,
                                                                            "down",
                                                                        )
                                                                    }
                                                                    className={`
                                                                        rounded-lg
                                                                        p-1.5
                                                                        transition
                                                                        focus:outline-none
                                                                        focus:ring-2
                                                                        focus:ring-sky-400/40
                                                                        ${
                                                                            currentFeedback ===
                                                                            "down"
                                                                                ? "bg-red-50 text-red-500"
                                                                                : "text-slate-400 hover:bg-white hover:text-slate-600"
                                                                        }
                                                                    `}
                                                                    aria-label="Not helpful"
                                                                    title="Not helpful"
                                                                    aria-pressed={
                                                                        currentFeedback ===
                                                                        "down"
                                                                    }
                                                                >
                                                                    <ThumbsDown className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}

                                                            {!message.error && currentFeedback === "down" && (
                                                                <div className="ml-1 mt-2 w-full max-w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                                                    <p className="text-[11px] font-semibold text-slate-700">What could be improved?</p>
                                                                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                                                                        {[
                                                                            ["incorrect", "Incorrect info"],
                                                                            ["did-not-answer", "Didn't answer"],
                                                                            ["too-vague", "Too vague"],
                                                                            ["too-long", "Too long"],
                                                                        ].map(([value, label]) => (
                                                                            <button
                                                                                key={value}
                                                                                type="button"
                                                                                onClick={() => setFeedbackReason((state) => ({ ...state, [message.id]: value }))}
                                                                                className={`rounded-lg border px-2 py-1.5 text-[10px] transition ${feedbackReason[message.id] === value ? "border-sky-300 bg-sky-50 text-sky-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                                                                            >
                                                                                {label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                    <textarea
                                                                        value={feedbackComment[message.id] || ""}
                                                                        onChange={(event) => setFeedbackComment((state) => ({ ...state, [message.id]: event.target.value.slice(0, 500) }))}
                                                                        placeholder="Optional comment"
                                                                        rows={2}
                                                                        className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-[10px] outline-none focus:border-sky-300"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        disabled={feedbackSubmitting === message.id}
                                                                        onClick={() => void submitNegativeFeedback(message.id)}
                                                                        className="mt-2 rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50"
                                                                    >
                                                                        {feedbackSubmitting === message.id ? "Saving…" : "Send feedback"}
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Retry */}

                                                            {message.error && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        retryLastMessage(
                                                                            message.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    className="
                                                                        ml-1
                                                                        rounded-lg
                                                                        px-2
                                                                        py-1
                                                                        text-[10px]
                                                                        font-semibold
                                                                        text-sky-500
                                                                        transition
                                                                        hover:bg-white
                                                                        hover:text-sky-600
                                                                        focus:outline-none
                                                                        focus:ring-2
                                                                        focus:ring-sky-400/40
                                                                        disabled:cursor-not-allowed
                                                                        disabled:opacity-50
                                                                    "
                                                                    aria-label="Retry request"
                                                                >
                                                                    Retry
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    },
                                )}
                            </AnimatePresence>

                            {/* Typing indicator */}

                            <AnimatePresence>
                                {loading && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -4,
                                        }}
                                    >
                                        <TypingIndicator />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={bottomRef} />
                        </div>

                        {/* =================================================
                            SUGGESTIONS
                        ================================================== */}

                        <AnimatePresence>
                            {messages.length === 1 &&
                                !loading && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: "auto",
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                        }}
                                        className="
                                            shrink-0
                                            overflow-hidden
                                            border-t
                                            border-slate-100
                                            bg-white
                                        "
                                    >
                                        <div className="px-4 py-3">
                                            <div className="mb-2.5 flex items-center gap-2">
                                                <Sparkles className="h-3.5 w-3.5 text-sky-500" />

                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        uppercase
                                                        tracking-[0.18em]
                                                        text-slate-400
                                                    "
                                                >
                                                    Try asking
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.map(
                                                    (
                                                        suggestion,
                                                    ) => (
                                                        <motion.button
                                                            key={
                                                                suggestion
                                                            }
                                                            type="button"
                                                            whileHover={{
                                                                y: -1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.97,
                                                            }}
                                                            onClick={() =>
                                                                void sendMessage(
                                                                    suggestion,
                                                                )
                                                            }
                                                            disabled={
                                                                loading
                                                            }
                                                            className="
                                                                rounded-full
                                                                border
                                                                border-slate-200
                                                                bg-slate-50
                                                                px-3
                                                                py-2
                                                                text-left
                                                                text-[11px]
                                                                font-medium
                                                                text-slate-600
                                                                transition
                                                                hover:border-sky-300
                                                                hover:bg-sky-50
                                                                hover:text-sky-600
                                                                focus:outline-none
                                                                focus:ring-2
                                                                focus:ring-sky-400/40
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                            "
                                                        >
                                                            {
                                                                suggestion
                                                            }
                                                        </motion.button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                        </AnimatePresence>

                        {/* =================================================
                            INPUT
                        ================================================== */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
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
                            <div className="relative min-w-0 flex-1">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(
                                        event,
                                    ) =>
                                        handleInputChange(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={
                                        loading
                                    }
                                    maxLength={
                                        MAX_MESSAGE_LENGTH
                                    }
                                    rows={1}
                                    autoComplete="off"
                                    spellCheck={true}
                                    placeholder="Ask about my skills..."
                                    aria-label="Message"
                                    className="
                                        min-h-12
                                        max-h-[120px]
                                        w-full
                                        resize-none
                                        overflow-y-auto
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-4
                                        py-3
                                        pr-12
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

                                {input.length > 0 && (
                                    <span
                                        className="
                                            pointer-events-none
                                            absolute
                                            bottom-1.5
                                            right-3
                                            text-[9px]
                                            text-slate-300
                                        "
                                        aria-hidden="true"
                                    >
                                        {
                                            input.length
                                        }
                                        /
                                        {
                                            MAX_MESSAGE_LENGTH
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Send button */}

                            <motion.button
                                type="submit"
                                disabled={
                                    loading ||
                                    !input.trim()
                                }
                                whileHover={
                                    !loading &&
                                    input.trim()
                                        ? {
                                              scale: 1.03,
                                          }
                                        : undefined
                                }
                                whileTap={
                                    !loading &&
                                    input.trim()
                                        ? {
                                              scale: 0.94,
                                          }
                                        : undefined
                                }
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    self-end
                                    rounded-2xl
                                    bg-sky-500
                                    text-white
                                    shadow-lg
                                    shadow-sky-500/20
                                    transition
                                    hover:bg-sky-400
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-sky-400/30
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                    disabled:shadow-none
                                "
                                aria-label="Send message"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{
                                            rotate: 360,
                                        }}
                                        transition={{
                                            duration: 1,
                                            repeat:
                                                Infinity,
                                            ease: "linear",
                                        }}
                                        aria-hidden="true"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                    </motion.div>
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </motion.button>
                        </form>

                        {/* =================================================
                            FOOTER
                        ================================================== */}

                        <div
                            className="
                                flex
                                shrink-0
                                items-center
                                justify-center
                                gap-1.5
                                border-t
                                border-slate-100
                                bg-white
                                px-4
                                py-2
                                text-[9px]
                                uppercase
                                tracking-[0.14em]
                                text-slate-300
                            "
                        >
                            <Check className="h-3 w-3 text-emerald-400" />
                            AI portfolio assistant
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
