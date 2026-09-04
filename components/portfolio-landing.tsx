"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowRight,
    BriefcaseBusiness,
    Check,
    ChevronRight,
    Code2,
    Database,
    ExternalLink,
    // Github,
    Eye,
    ArrowUpRight,
    Bot,
    Layers3,
    Mail,
    Menu,
    Moon,
    Palette,
    Server,
    Sparkles,
    SunMedium,
    X,
    Zap,
} from "lucide-react";

import PortfolioChatbot from "@/components/portfolio-chatbot";
import { useChatbotStore } from "@/lib/chatbot-store";

/* ================================================================
   TYPES
================================================================ */

type SkillItem = {
    id: number;
    name: string;
    category?: string;
};

type ProfileItem = {
    name: string;
    title: string;
    headline: string;
    bio: string;
    email?: string | null;
    location?: string | null;
    summary: string;
    availability?: string | null;
};

type ProjectItem = {
    id: number;
    slug: string;
    title: string;
    summary: string;
    status: string;
    featured?: boolean;
    url?: string | null;
    githubUrl?: string | null;
    imageUrl?: string | null;
    tags?: string | null;
    skills?: Array<{ id: number; name: string; category: string }>;
};

type PortfolioLandingProps = {
    profile: ProfileItem;
    skillList: SkillItem[];
    projectList: ProjectItem[];
};

/* ================================================================
   DATA
================================================================ */

const navItems = [
    {
        label: "Work",
        href: "#work",
        id: "work",
    },
    {
        label: "Services",
        href: "#services",
        id: "services",
    },
    {
        label: "Stack",
        href: "#stack",
        id: "stack",
    },
    {
        label: "Contact",
        href: "#contact",
        id: "contact",
    },
];

const services = [
    {
        number: "01",
        icon: Layers3,
        title: "Launch a new product",
        text:
            "Turn an idea into a polished, production-ready web application designed around real business goals.",
    },
    {
        number: "02",
        icon: Zap,
        title: "Modernize an existing app",
        text:
            "Improve performance, UX, architecture and maintainability without throwing away what already works.",
    },
    {
        number: "03",
        icon: Database,
        title: "Business dashboards",
        text:
            "Build powerful internal tools, reporting systems and workflow applications that make teams more productive.",
    },
    {
        number: "04",
        icon: Sparkles,
        title: "AI-powered experiences",
        text:
            "Add useful AI assistants, intelligent search, automation and AI-powered workflows to existing products.",
    },
];

const fallbackSkillGroups = {
    frontend: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
    ],
    backend: [
        "Node.js",
        "Express",
        "REST APIs",
    ],
    data: [
        "PostgreSQL",
        "MongoDB",
        "Prisma",
        "SQLite",
    ],
    ai: [
        "AI Integration",
        "AI Assistants",
        "Automation",
    ],
};

const sectionReveal = {
    hidden: {
        opacity: 0,
        y: 28,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
};

const cardReveal = {
    hidden: {
        opacity: 0,
        y: 22,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
};

/* ================================================================
   HELPERS
================================================================ */

function parseTags(tags?: string | null) {
    return (tags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function ProjectPreview({
    project,
}: {
    project: ProjectItem;
}) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    const updateScrollable = () => {
        const viewport = viewportRef.current;
        const image = imageRef.current;

        if (!viewport || !image) {
            return;
        }

        setIsScrollable(
            viewport.scrollHeight > viewport.clientHeight + 4 ||
                viewport.scrollWidth > viewport.clientWidth + 4,
        );
    };

    useEffect(() => {
        const image = imageRef.current;

        if (!image) {
            return;
        }

        updateScrollable();

        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(updateScrollable)
                : null;

        resizeObserver?.observe(image);
        window.addEventListener("resize", updateScrollable, { passive: true });

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener("resize", updateScrollable);
        };
    }, [project.imageUrl]);

    return (
        <div
            ref={viewportRef}
            className="project-preview-scroll absolute inset-x-0 bottom-0 top-9 overflow-auto overscroll-contain bg-slate-900"
            aria-label={`${project.title} preview. Scroll to explore the full image when needed.`}
        >
            {project.imageUrl ? (
                <img
                    ref={imageRef}
                    src={project.imageUrl}
                    alt={`${project.title} project preview`}
                    onLoad={updateScrollable}
                    className="block h-auto min-h-full w-full max-w-none object-contain object-top align-top transition duration-500 group-hover:brightness-105"
                />
            ) : (
                <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-sky-500/20 via-slate-900 to-slate-950">
                    <Code2 className="h-16 w-16 text-sky-400/60" />
                </div>
            )}

            {isScrollable && (
                <>
                    <div className="pointer-events-none sticky bottom-0 left-0 right-0 flex justify-center pb-3">
                        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-xl">
                            Scroll to explore
                        </span>
                    </div>
                    <div className="pointer-events-none sticky bottom-0 left-0 right-0 -mt-14 h-14 bg-gradient-to-t from-slate-950/80 to-transparent" />
                </>
            )}
        </div>
    );
}

/* ================================================================
   COMPONENT
================================================================ */

export function PortfolioLanding({
    profile,
    skillList,
    projectList,
}: PortfolioLandingProps) {
    const [theme, setTheme] =
        useState<"light" | "dark">("light");

    const [mobileMenu, setMobileMenu] =
        useState(false);

    const [showAllProjects, setShowAllProjects] =
        useState(false);

    const [scrolled, setScrolled] =
        useState(false);

    const [activeSection, setActiveSection] =
        useState("work");

    const openChat = useChatbotStore((state) => state.openChat);

    /* ============================================================
       THEME
    ============================================================ */

    useEffect(() => {
        const savedTheme =
            localStorage.getItem("portfolio-theme");

        const nextTheme =
            savedTheme === "dark"
                ? "dark"
                : "light";

        setTheme(nextTheme);

        document.documentElement.dataset.theme =
            nextTheme;
    }, []);

    useEffect(() => {
        document.documentElement.dataset.theme =
            theme;

        localStorage.setItem(
            "portfolio-theme",
            theme,
        );
    }, [theme]);

    /* ============================================================
       SCROLL STATE
    ============================================================ */

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24);
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
            },
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll,
            );
        };
    }, []);

    /* ============================================================
       ACTIVE NAVIGATION SECTION
    ============================================================ */

    useEffect(() => {
        const sections = navItems
            .map((item) =>
                document.getElementById(item.id),
            )
            .filter(
                (
                    section,
                ): section is HTMLElement =>
                    Boolean(section),
            );

        if (!sections.length) {
            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    const visibleEntries =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting,
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio,
                            );

                    const first =
                        visibleEntries[0];

                    if (first) {
                        setActiveSection(
                            first.target.id,
                        );
                    }
                },
                {
                    rootMargin:
                        "-25% 0px -55% 0px",
                    threshold: [0.05, 0.15, 0.3],
                },
            );

        sections.forEach((section) =>
            observer.observe(section),
        );

        return () => observer.disconnect();
    }, []);

    /* ============================================================
       CLOSE MOBILE MENU ON ESCAPE
    ============================================================ */

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                setMobileMenu(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, []);

    /* ============================================================
       PROJECTS
    ============================================================ */

    const projects = useMemo(() => {
        return [...projectList].sort((a, b) => {
            // `featured` is the source of truth for the public featured build.
            // Do not derive featured state from the lifecycle `status` field.
            const aFeatured = a.featured ? 1 : 0;
            const bFeatured = b.featured ? 1 : 0;

            if (aFeatured !== bFeatured) {
                return bFeatured - aFeatured;
            }

            return 0;
        });
    }, [projectList]);

    const featuredProject = projects.find((project) => project.featured) ?? null;

    const visibleProjects = showAllProjects
        ? projects
        : projects.slice(0, 4);

    const featuredCount = projects.filter((project) => project.featured).length;

    const remainingProjects =
        visibleProjects.slice(1);

    const hasMoreProjects =
        projects.length > 4;

    /* ============================================================
       SKILLS
    ============================================================ */

    const groupedSkills = useMemo(() => {
        if (!skillList.length) {
            return fallbackSkillGroups;
        }

        const frontend: string[] = [];
        const backend: string[] = [];
        const data: string[] = [];
        const ai: string[] = [];

        skillList.forEach((skill) => {
            const name =
                skill.name.toLowerCase();

            if (
                name.includes("react") ||
                name.includes("next") ||
                name.includes("typescript") ||
                name.includes("javascript") ||
                name.includes("tailwind") ||
                name.includes("css") ||
                name.includes("html") ||
                name.includes("zustand") ||
                name.includes("frontend")
            ) {
                frontend.push(skill.name);
                return;
            }

            if (
                name.includes("node") ||
                name.includes("express") ||
                name.includes("api") ||
                name.includes("backend") ||
                name.includes("rest")
            ) {
                backend.push(skill.name);
                return;
            }

            if (
                name.includes("postgres") ||
                name.includes("mysql") ||
                name.includes("sqlite") ||
                name.includes("prisma") ||
                name.includes("redis") ||
                name.includes("database") ||
                name.includes("sql")
            ) {
                data.push(skill.name);
                return;
            }

            if (
                name.includes("ai") ||
                name.includes("openai") ||
                name.includes("gemini") ||
                name.includes("llm") ||
                name.includes("machine learning") ||
                name.includes("automation")
            ) {
                ai.push(skill.name);
                return;
            }

            frontend.push(skill.name);
        });

        return {
            frontend,
            backend,
            data,
            ai,
        };
    }, [skillList]);

    /* ============================================================
       THEME CLASSES
    ============================================================ */

    const isLight = theme === "light";

    const pageClass = isLight
        ? "bg-[#f5f8fc] text-slate-950"
        : "bg-[#070b12] text-white";

    const muted = isLight
        ? "text-slate-600"
        : "text-slate-400";

    const heading = isLight
        ? "text-slate-950"
        : "text-white";

    const panel = isLight
        ? "border-slate-200/80 bg-white"
        : "border-slate-800 bg-slate-900/70";

    const softPanel = isLight
        ? "border-slate-200/80 bg-white/70"
        : "border-slate-800/80 bg-slate-900/40";

    const secondaryButton = isLight
        ? "border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
        : "border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800";

    const tagClass = isLight
        ? "border-slate-200 bg-slate-50 text-slate-600"
        : "border-slate-700 bg-slate-950 text-slate-300";

    /* ============================================================
       RENDER
    ============================================================ */

    return (
        <main
            className={`
                min-h-screen
                overflow-hidden
                transition-colors
                duration-500
                ${pageClass}
            `}
        >
            {/* =====================================================
                ATMOSPHERIC BACKGROUND
            ====================================================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    -z-10
                    overflow-hidden
                "
            >
                <motion.div
                    animate={{
                        x: [0, 25, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`
                        absolute
                        left-[-15%]
                        top-[-10%]
                        h-[500px]
                        w-[500px]
                        rounded-full
                        blur-3xl
                        ${
                            isLight
                                ? "bg-sky-200/40"
                                : "bg-sky-950/30"
                        }
                    `}
                />

                <motion.div
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 25, 0],
                    }}
                    transition={{
                        duration: 17,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`
                        absolute
                        right-[-10%]
                        top-[25%]
                        h-[450px]
                        w-[450px]
                        rounded-full
                        blur-3xl
                        ${
                            isLight
                                ? "bg-blue-100/40"
                                : "bg-blue-950/20"
                        }
                    `}
                />

                <div
                    className={`
                        absolute
                        inset-0
                        ${
                            isLight
                                ? "opacity-[0.22]"
                                : "opacity-[0.1]"
                        }
                    `}
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)",
                        backgroundSize:
                            "48px 48px",
                        maskImage:
                            "linear-gradient(to bottom, black, transparent 75%)",
                    }}
                />
            </div>

            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <header className="sticky top-0 z-50">
                <motion.div
                    animate={{
                        boxShadow: scrolled
                            ? isLight
                                ? "0 10px 35px rgba(15,23,42,0.07)"
                                : "0 10px 35px rgba(0,0,0,0.22)"
                            : "0 0 0 rgba(0,0,0,0)",
                    }}
                    className={`
                        border-b
                        backdrop-blur-2xl
                        transition-colors
                        duration-300
                        ${
                            isLight
                                ? "border-slate-200/70 bg-white/75"
                                : "border-slate-800/70 bg-slate-950/75"
                        }
                    `}
                >
                    <div
                        className={`
                            mx-auto
                            flex
                            max-w-7xl
                            items-center
                            justify-between
                            px-6
                            transition-all
                            duration-300
                            ${
                                scrolled
                                    ? "h-16"
                                    : "h-20"
                            }
                        `}
                    >
                        {/* Logo */}

                        <a
                            href="#top"
                            onClick={() =>
                                setMobileMenu(false)
                            }
                            className="group flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{
                                    rotate: -4,
                                    scale: 1.05,
                                }}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-500
                                    text-white
                                    shadow-lg
                                    shadow-sky-500/20
                                "
                            >
                                <Code2 className="h-5 w-5" />
                            </motion.div>

                            <div>
                                <p
                                    className={`
                                        text-sm
                                        font-black
                                        tracking-tight
                                        ${heading}
                                    `}
                                >
                                    {profile.name}
                                </p>

                                <p
                                    className={`
                                        text-[10px]
                                        uppercase
                                        tracking-[0.2em]
                                        ${muted}
                                    `}
                                >
                                    {profile.title}
                                </p>
                            </div>
                        </a>

                        {/* Desktop navigation */}

                        <nav className="hidden items-center gap-2 md:flex">
                            {navItems.map((item) => {
                                const active =
                                    activeSection ===
                                    item.id;

                                return (
                                    <a
                                        key={item.id}
                                        href={
                                            item.href
                                        }
                                        className={`
                                            relative
                                            rounded-full
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            transition
                                            ${
                                                active
                                                    ? isLight
                                                        ? "text-slate-950"
                                                        : "text-white"
                                                    : muted
                                            }
                                        `}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="active-nav"
                                                className={`
                                                    absolute
                                                    inset-0
                                                    -z-10
                                                    rounded-full
                                                    ${
                                                        isLight
                                                            ? "bg-slate-100"
                                                            : "bg-white/10"
                                                    }
                                                `}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        <span className="transition-colors hover:text-sky-500">
                                            {item.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Actions */}

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setTheme(
                                        isLight
                                            ? "dark"
                                            : "light",
                                    )
                                }
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    transition
                                    ${secondaryButton}
                                `}
                                aria-label="Toggle color theme"
                            >
                                <AnimatePresence
                                    mode="wait"
                                    initial={false}
                                >
                                    <motion.span
                                        key={theme}
                                        initial={{
                                            opacity: 0,
                                            rotate: -30,
                                            scale: 0.7,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            rotate: 0,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            rotate: 30,
                                            scale: 0.7,
                                        }}
                                    >
                                        {isLight ? (
                                            <Moon className="h-4 w-4" />
                                        ) : (
                                            <SunMedium className="h-4 w-4 text-amber-400" />
                                        )}
                                    </motion.span>
                                </AnimatePresence>
                            </button>

                            <a
                                href="/admin"
                                className="
                                    hidden
                                    rounded-full
                                    bg-sky-500
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-slate-950
                                    transition
                                    hover:-translate-y-0.5
                                    hover:bg-sky-400
                                    sm:block
                                "
                            >
                                Admin
                            </a>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenu(
                                        (current) =>
                                            !current,
                                    )
                                }
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    md:hidden
                                    ${secondaryButton}
                                `}
                                aria-label="Toggle menu"
                                aria-expanded={
                                    mobileMenu
                                }
                            >
                                <AnimatePresence
                                    mode="wait"
                                    initial={false}
                                >
                                    <motion.span
                                        key={
                                            mobileMenu
                                                ? "close"
                                                : "menu"
                                        }
                                        initial={{
                                            opacity: 0,
                                            rotate: -45,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            rotate: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            rotate: 45,
                                        }}
                                    >
                                        {mobileMenu ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Menu className="h-5 w-5" />
                                        )}
                                    </motion.span>
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}

                    <AnimatePresence>
                        {mobileMenu && (
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
                                className={`
                                    overflow-hidden
                                    border-t
                                    md:hidden
                                    ${
                                        isLight
                                            ? "border-slate-200 bg-white"
                                            : "border-slate-800 bg-slate-950"
                                    }
                                `}
                            >
                                <motion.div
                                    initial={{
                                        y: -8,
                                    }}
                                    animate={{
                                        y: 0,
                                    }}
                                    className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4"
                                >
                                    {navItems.map(
                                        (
                                            item,
                                            index,
                                        ) => (
                                            <motion.a
                                                key={
                                                    item.id
                                                }
                                                href={
                                                    item.href
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    x: -8,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                }}
                                                transition={{
                                                    delay:
                                                        index *
                                                        0.04,
                                                }}
                                                onClick={() =>
                                                    setMobileMenu(
                                                        false,
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    items-center
                                                    justify-between
                                                    rounded-2xl
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    font-medium
                                                    transition
                                                    ${
                                                        activeSection ===
                                                        item.id
                                                            ? "bg-sky-50 text-sky-600"
                                                            : muted
                                                    }
                                                `}
                                            >
                                                {
                                                    item.label
                                                }

                                                <ChevronRight className="h-4 w-4" />
                                            </motion.a>
                                        ),
                                    )}

                                    <a
                                        href="/admin"
                                        onClick={() =>
                                            setMobileMenu(
                                                false,
                                            )
                                        }
                                        className="
                                            mt-2
                                            rounded-2xl
                                            bg-sky-500
                                            px-4
                                            py-3
                                            text-center
                                            text-sm
                                            font-bold
                                            text-slate-950
                                        "
                                    >
                                        Admin
                                    </a>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </header>

            {/* =====================================================
                HERO
            ====================================================== */}

            <section
                id="top"
                className="relative"
            >
                <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
                    <div className="grid items-center gap-16 lg:grid-cols-[1.25fr_0.75fr]">
                        {/* Hero copy */}

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.09,
                                    },
                                },
                            }}
                        >
                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 14 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.5 },
                                    },
                                }}
                                className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-sky-500"
                            >
                                Full-Stack AI Developer · Product Builder
                            </motion.p>

                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 18,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.55,
                                            ease: [
                                                0.16,
                                                1,
                                                0.3,
                                                1,
                                            ] as const,
                                        },
                                    },
                                }}
                                className={`
                                    mb-7
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    ${
                                        isLight
                                            ? "border-sky-200 bg-sky-50 text-sky-700"
                                            : "border-sky-400/30 bg-sky-500/10 text-sky-300"
                                    }
                                `}
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>

                                {profile.availability || "Open to selected projects"}
                            </motion.div>

                            <motion.h1
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 24,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.7,
                                            ease: [
                                                0.16,
                                                1,
                                                0.3,
                                                1,
                                            ] as const,
                                        },
                                    },
                                }}
                                className={`
                                    max-w-5xl
                                    text-5xl
                                    font-black
                                    leading-[0.94]
                                    tracking-[-0.055em]
                                    sm:text-6xl
                                    lg:text-[82px]
                                    ${heading}
                                `}
                            >
                                {profile.headline || "Building intelligent digital products with Full-Stack + AI."}
                            </motion.h1>

                            <motion.p
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 18,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.6,
                                            ease: [
                                                0.16,
                                                1,
                                                0.3,
                                                1,
                                            ] as const,
                                        },
                                    },
                                }}
                                className={`
                                    mt-8
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    sm:text-lg
                                    ${muted}
                                `}
                            >
                                {profile.bio || profile.summary}
                            </motion.p>

                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                        y: 18,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.55,
                                            ease: [
                                                0.16,
                                                1,
                                                0.3,
                                                1,
                                            ] as const,
                                        },
                                    },
                                }}
                                className="mt-9 flex flex-wrap gap-3"
                            >
                                <a
                                    href="#work"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-sky-500
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-bold
                                        text-slate-950
                                        shadow-xl
                                        shadow-sky-500/20
                                        transition
                                        hover:-translate-y-0.5
                                        hover:bg-sky-400
                                    "
                                >
                                    Explore my work
                                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                                </a>

                                <button
                                    type="button"
                                    onClick={openChat}
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        px-6
                                        py-3.5
                                        text-sm
                                        font-semibold
                                        transition
                                        hover:-translate-y-0.5
                                        ${secondaryButton}
                                    `}
                                >
                                    <Bot className="h-4 w-4" />
                                    Ask my AI assistant
                                </button>
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: {
                                        opacity: 0,
                                    },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            duration: 0.5,
                                        },
                                    },
                                }}
                                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
                            >
                                {[
                                    "Full-stack development",
                                    "Product design",
                                    "AI integration",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            text-xs
                                            ${muted}
                                        `}
                                    >
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />

                                        {item}
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Hero visual */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.94,
                                y: 18,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.75,
                                delay: 0.2,
                                ease: [
                                    0.16,
                                    1,
                                    0.3,
                                    1,
                                ] as const,
                            }}
                            className="relative"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative"
                            >
                                <div className="absolute -inset-6 rounded-[40px] bg-sky-500/10 blur-3xl" />

                                <div
                                    className={`
                                        relative
                                        overflow-hidden
                                        rounded-[32px]
                                        border
                                        p-2
                                        shadow-2xl
                                        ${
                                            isLight
                                                ? "border-slate-200 bg-white"
                                                : "border-slate-800 bg-slate-900"
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            relative
                                            overflow-hidden
                                            rounded-[26px]
                                            bg-slate-950
                                            p-8
                                            text-white
                                            sm:p-10
                                        "
                                    >
                                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />

                                        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

                                        <div className="relative">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                                                        Digital product
                                                        builder
                                                    </p>

                                                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                                        Flunco
                                                        <span className="text-sky-400">
                                                            .
                                                        </span>
                                                    </h2>
                                                </div>

                                                <motion.div
                                                    whileHover={{
                                                        rotate: 6,
                                                        scale: 1.05,
                                                    }}
                                                    className="
                                                        flex
                                                        h-12
                                                        w-12
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        bg-sky-500
                                                        shadow-lg
                                                        shadow-sky-500/20
                                                    "
                                                >
                                                    <Code2 className="h-5 w-5 text-white" />
                                                </motion.div>
                                            </div>

                                            <div className="mt-12">
                                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                                    Focus
                                                </p>

                                                <p className="mt-3 text-2xl font-bold leading-tight">
                                                    Products
                                                    <br />
                                                    SaaS
                                                    <br />
                                                    Dashboards
                                                </p>
                                            </div>

                                            <div className="mt-10 grid grid-cols-2 gap-3">
                                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                                    <Code2 className="h-4 w-4 text-sky-400" />

                                                    <p className="mt-3 text-xs text-slate-400">
                                                        Engineering
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold">
                                                        Full Stack
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                                    <Palette className="h-4 w-4 text-sky-400" />

                                                    <p className="mt-3 text-xs text-slate-400">
                                                        Experience
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold">
                                                        Product Design
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-300">
                                                <motion.span
                                                    animate={{
                                                        opacity: [
                                                            0.5,
                                                            1,
                                                            0.5,
                                                        ],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                    }}
                                                    className="h-2 w-2 rounded-full bg-emerald-400"
                                                />

                                                Available for selected projects
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Hero stats */}

                    <div className="mt-20 grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                value: `${featuredCount || projectList.length}`,
                                label: featuredCount ? "Featured projects" : "Projects",
                            },
                            {
                                value: `${skillList.length}+`,
                                label: "Technical skills",
                            },
                            {
                                value: profile.title.includes("Product") ? "Full stack + design" : "Full-stack delivery",
                                label: "Primary focus",
                            },
                        ].map(
                            (
                                stat,
                                index,
                            ) => (
                                <motion.div
                                    key={
                                        stat.label
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay:
                                            0.45 +
                                            index *
                                                0.1,
                                        duration:
                                            0.5,
                                        ease: [
                                            0.16,
                                            1,
                                            0.3,
                                            1,
                                        ] as const,
                                    }}
                                    whileHover={{
                                        y: -3,
                                    }}
                                    className={`
                                        rounded-2xl
                                        border
                                        p-6
                                        transition
                                        ${panel}
                                    `}
                                >
                                    <p
                                        className={`
                                            text-3xl
                                            font-black
                                            tracking-tight
                                            ${heading}
                                        `}
                                    >
                                        {
                                            stat.value
                                        }
                                    </p>

                                    <p
                                        className={`
                                            mt-2
                                            text-xs
                                            uppercase
                                            tracking-[0.15em]
                                            ${muted}
                                        `}
                                    >
                                        {
                                            stat.label
                                        }
                                    </p>
                                </motion.div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* =====================================================
                WORK
            ====================================================== */}

            <section
                id="work"
                className="relative scroll-mt-24 overflow-hidden border-t border-slate-200/60 dark:border-slate-800/60"
            >
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky-500/[0.07] to-transparent" />

                <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionReveal}
                        className="relative mb-14 grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end"
                    >
                        <div>
                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-10 bg-sky-500" />
                                <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500">
                                    Selected work
                                </p>
                            </div>

                            <h2 className={`max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl ${heading}`}>
                                Built to look sharp.
                                <br />
                                <span className="text-sky-500">Engineered to matter.</span>
                            </h2>
                        </div>

                        <div className="lg:pb-1">
                            <p className={`max-w-lg text-sm leading-7 ${muted}`}>
                                A curated set of product concepts and full-stack builds focused on real workflows, thoughtful interfaces and production-minded engineering.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${tagClass}`}>
                                    {projects.length} builds
                                </span>
                                <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${tagClass}`}>
                                    Full-stack
                                </span>
                                <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${tagClass}`}>
                                    AI + product
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {!projects.length ? (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={sectionReveal}
                            className={`rounded-[32px] border border-dashed p-12 text-center ${softPanel}`}
                        >
                            <Code2 className="mx-auto h-10 w-10 text-sky-500" />
                            <h3 className={`mt-5 text-xl font-bold ${heading}`}>Projects are being prepared.</h3>
                            <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${muted}`}>
                                New work will appear here as it is added through the portfolio dashboard.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-7">
                            {visibleProjects.map((project, index) => {
                                const tags = parseTags(project.tags);
                                const skillNames = (project.skills ?? []).map((skill) => skill.name);
                                const displayTags = Array.from(new Set([...skillNames, ...tags]));
                                const isFeatured = project.featured === true;
                                const hasLiveUrl = Boolean(project.url);
                                const hasGithub = Boolean(project.githubUrl);

                                return (
                                    <motion.article
                                        key={project.id}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.12 }}
                                        variants={cardReveal}
                                        transition={{ delay: Math.min(index * 0.06, 0.25) }}
                                        className={`group relative overflow-hidden rounded-[32px] border ${panel} ${isFeatured ? "shadow-2xl shadow-sky-950/10" : ""}`}
                                    >
                                        {isFeatured && (
                                            <div className="absolute right-6 top-6 z-20 rounded-full border border-sky-300/20 bg-sky-500 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-950 shadow-lg shadow-sky-500/20">
                                                Featured build
                                            </div>
                                        )}

                                        <div className={`grid ${isFeatured ? "lg:grid-cols-[1.35fr_0.65fr]" : "lg:grid-cols-[0.95fr_1.05fr]"}`}>
                                            <div className={`relative overflow-hidden ${isFeatured ? "min-h-[390px] lg:min-h-[500px]" : "min-h-[280px]"}`}>
                                                <div className="absolute inset-0 bg-slate-950" />
                                                <div className="absolute -inset-16 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.16),transparent_30%)]" />

                                                <motion.div
                                                    whileHover={{ scale: 1.025, y: -3 }}
                                                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                                    className="absolute inset-2.5 overflow-hidden rounded-[18px] border border-white/10 bg-slate-900 shadow-2xl sm:inset-3.5"
                                                >
                                                    <div className="flex h-9 items-center gap-1.5 border-b border-white/10 bg-slate-950/90 px-4">
                                                        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                                                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                                                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                                                        <div className="mx-auto h-5 w-2/5 rounded-md border border-white/10 bg-white/[0.04]" />
                                                    </div>

                                                    <ProjectPreview project={project} />
                                                </motion.div>

                                                <div className="absolute bottom-7 left-7 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                                                    <Eye className="h-3 w-3" />
                                                    Product preview
                                                </div>
                                            </div>

                                            <div className={`flex flex-col justify-between ${isFeatured ? "p-7 sm:p-10" : "p-7 sm:p-9"}`}>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-500">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        <span className={`h-px w-8 ${isLight ? "bg-slate-200" : "bg-slate-700"}`} />
                                                        <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${tagClass}`}>
                                                            {project.status || "Build"}
                                                        </span>
                                                    </div>

                                                    <h3 className={`mt-7 text-3xl font-black leading-tight tracking-[-0.03em] ${heading} ${isFeatured ? "sm:text-4xl" : "sm:text-3xl"}`}>
                                                        {project.title}
                                                    </h3>

                                                    <p className={`mt-4 max-w-xl text-sm leading-7 ${muted}`}>
                                                        {project.summary}
                                                    </p>

                                                    {displayTags.length > 0 && (
                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {displayTags.slice(0, isFeatured ? 7 : 5).map((tag) => (
                                                                <span key={tag} className={`rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] ${tagClass}`}>
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-slate-200/60 pt-6 dark:border-slate-800/70">
                                                    <a
                                                        href={`/projects/${project.slug}`}
                                                        className="group/link inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                                                    >
                                                        Case study
                                                        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                                    </a>

                                                    {hasLiveUrl ? (
                                                        <a
                                                            href={project.url!}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="group/link inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-sky-400"
                                                        >
                                                            Live demo
                                                            <ExternalLink className="h-3.5 w-3.5 transition group-hover/link:translate-x-0.5" />
                                                        </a>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold ${tagClass}`}>
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                                            Not deployed yet
                                                        </span>
                                                    )}

                                                    {hasGithub && (
                                                        <a
                                                            href={project.githubUrl!}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 ${secondaryButton}`}
                                                        >
                                                            {/* <Github className="h-3.5 w-3.5" /> */}
                                                            Source code
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    )}

                    {hasMoreProjects && (
                        <div className="mt-10 flex justify-center">
                            <motion.button
                                type="button"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAllProjects((current) => !current)}
                                className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${secondaryButton}`}
                            >
                                {showAllProjects ? "Show less" : `Show all ${projects.length} projects`}
                            </motion.button>
                        </div>
                    )}
                </div>
            </section>

            {/* =====================================================
                AI ASSISTANT SHOWCASE
            ====================================================== */}

            <section className="relative overflow-hidden border-y border-slate-200/60 dark:border-slate-800/60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(99,102,241,0.10),transparent_28%)]" />

                <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-24">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={sectionReveal}
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-sky-500" />
                            <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-500">
                                Built into the portfolio
                            </p>
                        </div>

                        <h2 className={`max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl ${heading}`}>
                            Don&apos;t just read my portfolio.
                            <br />
                            <span className="text-sky-500">Ask it.</span>
                        </h2>

                        <p className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${muted}`}>
                            My AI portfolio assistant can help visitors explore my skills, projects, experience and the kind of products I build.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={openChat}
                                className="group inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-sky-500/15 transition hover:-translate-y-0.5 hover:bg-sky-400"
                            >
                                <Bot className="h-4 w-4" />
                                Start a conversation
                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24, rotate: 1 }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative overflow-hidden rounded-[28px] border p-5 shadow-2xl ${panel}`}
                    >
                        <div className="flex items-center gap-3 border-b border-slate-200/70 pb-4 dark:border-slate-800/70">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <p className={`text-sm font-black ${heading}`}>Portfolio AI</p>
                                <p className="text-xs text-emerald-500">Online · Ready to answer</p>
                            </div>
                        </div>

                        <div className="space-y-3 py-5">
                            <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-sky-500 px-4 py-3 text-sm font-medium text-slate-950">
                                What kind of products can you build?
                            </div>
                            <div className={`max-w-[88%] rounded-2xl rounded-bl-md border px-4 py-3 text-sm leading-6 ${softPanel}`}>
                                Full-stack web apps, SaaS dashboards, business platforms and AI-powered experiences — with a focus on usability, performance and maintainable architecture.
                            </div>
                        </div>

                        <div className={`rounded-2xl border px-4 py-3 text-xs ${tagClass}`}>
                            Try asking about projects, skills, architecture or experience →
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* =====================================================
                SERVICES
            ====================================================== */}

            <section
                id="services"
                className="scroll-mt-24"
            >
                <div className="mx-auto max-w-7xl px-6 py-24">
                    <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            variants={sectionReveal}
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500">
                                What I can build
                            </p>

                            <h2
                                className={`
                                    mt-4
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    sm:text-5xl
                                    ${heading}
                                `}
                            >
                                From idea
                                <br />
                                to production.
                            </h2>

                            <p
                                className={`
                                    mt-5
                                    max-w-md
                                    text-sm
                                    leading-7
                                    ${muted}
                                `}
                            >
                                I help businesses design,
                                build and improve digital
                                products that are useful,
                                fast and easy to maintain.
                            </p>

                            <a
                                href="#contact"
                                className="
                                    mt-7
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-bold
                                    text-sky-500
                                    hover:text-sky-400
                                "
                            >
                                Discuss your project

                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </motion.div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {services.map(
                                (
                                    service,
                                    index,
                                ) => {
                                    const Icon =
                                        service.icon;

                                    return (
                                        <motion.article
                                            key={
                                                service.number
                                            }
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{
                                                once: true,
                                                amount: 0.15,
                                            }}
                                            variants={{
                                                ...cardReveal,
                                                visible:
                                                    {
                                                        opacity: 1,
                                                        y: 0,
                                                        transition:
                                                            {
                                                                duration:
                                                                    0.5,
                                                                delay:
                                                                    index *
                                                                    0.08,
                                                                ease: [
                                                                    0.16,
                                                                    1,
                                                                    0.3,
                                                                    1,
                                                                ] as const,
                                                            },
                                                    },
                                            }}
                                            whileHover={{
                                                y: -4,
                                            }}
                                            className={`
                                                group
                                                rounded-[26px]
                                                border
                                                p-6
                                                transition
                                                duration-300
                                                ${softPanel}
                                            `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black text-sky-500">
                                                    {
                                                        service.number
                                                    }
                                                </span>

                                                <motion.div
                                                    whileHover={{
                                                        rotate: 5,
                                                        scale: 1.06,
                                                    }}
                                                    className={`
                                                        flex
                                                        h-10
                                                        w-10
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        ${
                                                            isLight
                                                                ? "bg-sky-50 text-sky-600"
                                                                : "bg-sky-500/10 text-sky-400"
                                                        }
                                                    `}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </motion.div>
                                            </div>

                                            <h3
                                                className={`
                                                    mt-8
                                                    text-xl
                                                    font-bold
                                                    ${heading}
                                                `}
                                            >
                                                {
                                                    service.title
                                                }
                                            </h3>

                                            <p
                                                className={`
                                                    mt-3
                                                    text-sm
                                                    leading-6
                                                    ${muted}
                                                `}
                                            >
                                                {
                                                    service.text
                                                }
                                            </p>
                                        </motion.article>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                STACK
            ====================================================== */}

            <section
                id="stack"
                className="scroll-mt-24"
            >
                <div className="mx-auto max-w-7xl px-6 py-24">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            amount: 0.15,
                        }}
                        variants={sectionReveal}
                        className={`
                            overflow-hidden
                            rounded-[32px]
                            border
                            p-8
                            sm:p-10
                            lg:p-12
                            ${panel}
                        `}
                    >
                        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500">
                                    Engineering stack
                                </p>

                                <h2
                                    className={`
                                        mt-4
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        sm:text-4xl
                                        ${heading}
                                    `}
                                >
                                    Tools that turn
                                    <br />
                                    ideas into products.
                                </h2>

                                <p
                                    className={`
                                        mt-4
                                        max-w-md
                                        text-sm
                                        leading-7
                                        ${muted}
                                    `}
                                >
                                    A modern, practical
                                    stack focused on
                                    maintainability,
                                    performance and great
                                    user experiences.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    {
                                        title: "Frontend",
                                        icon: Code2,
                                        items:
                                            groupedSkills.frontend,
                                    },
                                    {
                                        title: "Backend",
                                        icon: Server,
                                        items:
                                            groupedSkills.backend,
                                    },
                                    {
                                        title: "Data",
                                        icon: Database,
                                        items:
                                            groupedSkills.data,
                                    },
                                    {
                                        title: "AI & Automation",
                                        icon: Sparkles,
                                        items:
                                            groupedSkills.ai,
                                    },
                                ].map(
                                    (
                                        group,
                                    ) => {
                                        const Icon =
                                            group.icon;

                                        return (
                                            <motion.div
                                                key={
                                                    group.title
                                                }
                                                whileHover={{
                                                    y: -3,
                                                }}
                                                className={`
                                                    rounded-2xl
                                                    border
                                                    p-5
                                                    transition
                                                    ${softPanel}
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="h-4 w-4 text-sky-500" />

                                                    <h3
                                                        className={`
                                                            text-sm
                                                            font-bold
                                                            ${heading}
                                                        `}
                                                    >
                                                        {
                                                            group.title
                                                        }
                                                    </h3>
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {group.items.map(
                                                        (
                                                            skill,
                                                        ) => (
                                                            <motion.span
                                                                key={
                                                                    skill
                                                                }
                                                                whileHover={{
                                                                    y: -1,
                                                                }}
                                                                className={`
                                                                    rounded-full
                                                                    border
                                                                    px-3
                                                                    py-1.5
                                                                    text-[10px]
                                                                    font-medium
                                                                    ${tagClass}
                                                                `}
                                                            >
                                                                {
                                                                    skill
                                                                }
                                                            </motion.span>
                                                        ),
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* =====================================================
                PHILOSOPHY
            ====================================================== */}

            <section>
                <div className="mx-auto max-w-7xl px-6 py-24">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            variants={sectionReveal}
                        >
                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-500">
                                How I work
                            </p>

                            <h2
                                className={`
                                    mt-4
                                    text-4xl
                                    font-black
                                    tracking-tight
                                    sm:text-5xl
                                    ${heading}
                                `}
                            >
                                Good software
                                <br />
                                starts with clarity.
                            </h2>

                            <p
                                className={`
                                    mt-5
                                    max-w-xl
                                    text-base
                                    leading-7
                                    ${muted}
                                `}
                            >
                                The goal isn't to write the
                                most code. It's to understand
                                the problem, design the right
                                solution and ship software
                                that creates lasting value.
                            </p>
                        </motion.div>

                        <div className="space-y-3">
                            {[
                                {
                                    number: "01",
                                    title: "Business first",
                                    text:
                                        "Understand the goal before choosing the technology.",
                                },
                                {
                                    number: "02",
                                    title: "Clean engineering",
                                    text:
                                        "Build software that is reliable, maintainable and ready to grow.",
                                },
                                {
                                    number: "03",
                                    title: "Long-term thinking",
                                    text:
                                        "Create systems that continue working after launch.",
                                },
                            ].map(
                                (
                                    item,
                                    index,
                                ) => (
                                    <motion.div
                                        key={
                                            item.number
                                        }
                                        initial={{
                                            opacity: 0,
                                            x: 20,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                            amount: 0.15,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay:
                                                index *
                                                0.08,
                                            ease: [
                                                0.16,
                                                1,
                                                0.3,
                                                1,
                                            ] as const,
                                        }}
                                        whileHover={{
                                            x: 4,
                                        }}
                                        className={`
                                            group
                                            flex
                                            gap-5
                                            rounded-2xl
                                            border
                                            p-5
                                            transition
                                            ${softPanel}
                                        `}
                                    >
                                        <span className="pt-1 text-xs font-black text-sky-500">
                                            {
                                                item.number
                                            }
                                        </span>

                                        <div>
                                            <h3
                                                className={`
                                                    font-bold
                                                    ${heading}
                                                `}
                                            >
                                                {
                                                    item.title
                                                }
                                            </h3>

                                            <p
                                                className={`
                                                    mt-1
                                                    text-sm
                                                    leading-6
                                                    ${muted}
                                                `}
                                            >
                                                {
                                                    item.text
                                                }
                                            </p>
                                        </div>
                                    </motion.div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                CONTACT
            ====================================================== */}

            <section
                id="contact"
                className="scroll-mt-24"
            >
                <div className="mx-auto max-w-7xl px-6 pb-16 pt-12">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 24,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                            ] as const,
                        }}
                        className="
                            relative
                            overflow-hidden
                            rounded-[36px]
                            border
                            border-sky-300/30
                            bg-gradient-to-br
                            from-sky-400
                            via-sky-500
                            to-blue-500
                            p-8
                            text-center
                            shadow-2xl
                            shadow-sky-500/10
                            sm:p-12
                            lg:p-16
                        "
                    >
                        {/* Atmospheric lights */}

                        <motion.div
                            animate={{
                                x: [0, 20, 0],
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="
                                absolute
                                -left-24
                                -top-24
                                h-72
                                w-72
                                rounded-full
                                bg-white/15
                                blur-3xl
                            "
                        />

                        <motion.div
                            animate={{
                                x: [0, -20, 0],
                                y: [0, 15, 0],
                            }}
                            transition={{
                                duration: 9,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="
                                absolute
                                -bottom-24
                                -right-24
                                h-72
                                w-72
                                rounded-full
                                bg-blue-950/10
                                blur-3xl
                            "
                        />

                        {/* Fine grid */}

                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-0
                                opacity-[0.08]
                            "
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                                backgroundSize:
                                    "40px 40px",
                                maskImage:
                                    "linear-gradient(to bottom, black, transparent)",
                            }}
                        />

                        <div className="relative">
                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    rotate: -3,
                                }}
                                className="
                                    mx-auto
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-slate-950
                                    text-white
                                    shadow-xl
                                "
                            >
                                <Mail className="h-5 w-5" />
                            </motion.div>

                            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-slate-950/60">
                                Have an idea worth building?
                            </p>

                            <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                Let&apos;s turn it into
                                something remarkable.
                            </h2>

                            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-950/70">
                                Tell me what you're
                                building, where you're
                                stuck, or what you want to
                                improve. Let's figure out
                                the right next step.
                            </p>

                            <motion.a
                                href={profile.email ? `mailto:${profile.email}` : "#contact"}
                                whileHover={{
                                    y: -2,
                                    scale: 1.01,
                                }}
                                whileTap={{
                                    scale: 0.98,
                                }}
                                className="
                                    mt-8
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-slate-950
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-xl
                                    transition
                                    hover:bg-slate-800
                                "
                            >
                                <Mail className="h-4 w-4" />

                                {profile.email || "Start a conversation"}

                                <ArrowRight className="h-4 w-4" />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer>
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p
                            className={`
                                text-sm
                                font-bold
                                ${heading}
                            `}
                        >
                            {profile.name}
                        </p>

                        <p
                            className={`
                                mt-1
                                text-xs
                                ${muted}
                            `}
                        >
                            {profile.title}.
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        {[
                            [
                                "Work",
                                "#work",
                            ],
                            [
                                "Services",
                                "#services",
                            ],
                            [
                                "Contact",
                                "#contact",
                            ],
                        ].map(
                            ([
                                label,
                                href,
                            ]) => (
                                <a
                                    key={
                                        href
                                    }
                                    href={
                                        href
                                    }
                                    className={`
                                        text-xs
                                        font-medium
                                        transition
                                        hover:text-sky-500
                                        ${muted}
                                    `}
                                >
                                    {
                                        label
                                    }
                                </a>
                            ),
                        )}

                        <a
                            href="/admin"
                            className={`
                                text-xs
                                font-medium
                                transition
                                hover:text-sky-500
                                ${muted}
                            `}
                        >
                            Admin
                        </a>
                    </div>
                </div>
            </footer>

            {/* =====================================================
                CHATBOT
            ====================================================== */}

            <PortfolioChatbot />
        </main>
    );
}

export default PortfolioLanding;