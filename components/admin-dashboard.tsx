"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Bot,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronRight,
    Code2,
    ExternalLink,
    Home,
    LayoutDashboard,
    Moon,
    PencilLine,
    Plus,
    Settings,
    Sparkles,
    Sun,
    Trash2,
    UserRound,
    Users,
    X,
} from "lucide-react";

type Skill = {
    id: number;
    name: string;
    category: string;
    order: number;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    status: string;
    summary: string;
    url?: string | null;
    githubUrl?: string | null;
    imageUrl?: string | null;
    tags: string;
    featured: boolean;
    description: string;
};

type AdminDashboardProps = {
    skills: Skill[];
    projects: Project[];

    createSkillAction: (
        formData: FormData,
    ) => Promise<unknown>;

    updateSkillAction: (
        formData: FormData,
    ) => Promise<unknown>;

    deleteSkillAction: (
        formData: FormData,
    ) => Promise<unknown>;

    createProjectAction: (
        formData: FormData,
    ) => Promise<unknown>;

    updateProjectAction: (
        formData: FormData,
    ) => Promise<unknown>;

    deleteProjectAction: (
        formData: FormData,
    ) => Promise<unknown>;
};

type Tab =
    | "dashboard"
    | "profile"
    | "skills"
    | "projects"
    | "experience"
    | "assistant"
    | "settings";

export function AdminDashboard({
    skills,
    projects,
    createSkillAction,
    updateSkillAction,
    deleteSkillAction,
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
}: AdminDashboardProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] =
        useState<Tab>("dashboard");

    const [dark, setDark] =
        useState(false);

    const [notice, setNotice] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [mobileMenu, setMobileMenu] =
        useState(false);

    const [skillSearch, setSkillSearch] =
        useState("");

    const [projectSearch, setProjectSearch] =
        useState("");

    const [showAllProjects, setShowAllProjects] =
        useState(false);

    async function runAction(
        action: (formData: FormData) => Promise<unknown>,
        formData: FormData,
        successText: string,
    ) {
        try {
            await action(formData);

            setNotice({
                type: "success",
                text: successText,
            });

            router.refresh();
        } catch (error) {
            setNotice({
                type: "error",
                text:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong.",
            });
        }
    }

    const filteredSkills = useMemo(() => {
        const query =
            skillSearch.trim().toLowerCase();

        if (!query) {
            return skills;
        }

        return skills.filter((skill) =>
            `${skill.name} ${skill.category}`
                .toLowerCase()
                .includes(query),
        );
    }, [skills, skillSearch]);

    const filteredProjects = useMemo(() => {
        const query =
            projectSearch.trim().toLowerCase();

        if (!query) {
            return projects;
        }

        return projects.filter((project) =>
            `${project.title} ${project.tags} ${project.summary}`
                .toLowerCase()
                .includes(query),
        );
    }, [projects, projectSearch]);

    const recentProjects =
        showAllProjects
            ? filteredProjects
            : filteredProjects.slice(0, 5);

    function navigate(tab: Tab) {
        setActiveTab(tab);
        setMobileMenu(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const navSections = [
        {
            label: "MANAGE CONTENT",
            items: [
                {
                    id: "profile" as Tab,
                    label: "Profile",
                    icon: UserRound,
                },
                {
                    id: "skills" as Tab,
                    label: "Skills",
                    icon: Code2,
                },
                {
                    id: "projects" as Tab,
                    label: "Projects",
                    icon: BriefcaseBusiness,
                },
                {
                    id: "experience" as Tab,
                    label: "Experience",
                    icon: Users,
                },
            ],
        },
        {
            label: "SYSTEM",
            items: [
                {
                    id: "settings" as Tab,
                    label: "Settings",
                    icon: Settings,
                },
                {
                    id: "assistant" as Tab,
                    label: "AI Assistant Data",
                    icon: Bot,
                },
            ],
        },
    ];

    return (
        <main
            className={
                dark
                    ? "min-h-screen bg-[#07111f] text-slate-100"
                    : "min-h-screen bg-[#f4f8fc] text-slate-900"
            }
        >
            <div className="flex min-h-screen">

                {/* MOBILE OVERLAY */}
                {mobileMenu && (
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() =>
                            setMobileMenu(false)
                        }
                        className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50
                        w-[270px]
                        border-r
                        transition-transform
                        duration-300
                        lg:sticky
                        lg:top-0
                        lg:translate-x-0
                        ${
                            mobileMenu
                                ? "translate-x-0"
                                : "-translate-x-full"
                        }
                        ${
                            dark
                                ? "border-slate-800 bg-[#0b1728]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <div className="flex h-full flex-col">

                        {/* BRAND */}
                        <div className="flex items-center gap-3 px-6 py-7">
                            <div
                                className="
                                    flex h-11 w-11
                                    items-center justify-center
                                    rounded-xl
                                    bg-gradient-to-br
                                    from-blue-600
                                    to-sky-500
                                    text-xl font-black text-white
                                    shadow-lg shadow-blue-500/20
                                "
                            >
                                F
                            </div>

                            <div>
                                <p
                                    className={`
                                        text-sm font-bold tracking-wide
                                        ${
                                            dark
                                                ? "text-white"
                                                : "text-slate-900"
                                        }
                                    `}
                                >
                                    FLUNCO RUIZ
                                </p>

                                <p
                                    className={`
                                        text-xs
                                        ${
                                            dark
                                                ? "text-slate-400"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    Portfolio Admin
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenu(false)
                                }
                                className="ml-auto lg:hidden"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* DASHBOARD */}
                        <div className="px-4">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("dashboard")
                                }
                                className={`
                                    flex w-full items-center gap-3
                                    rounded-xl px-4 py-3
                                    text-sm font-medium
                                    transition
                                    ${
                                        activeTab === "dashboard"
                                            ? "bg-blue-50 text-blue-600"
                                            : dark
                                                ? "text-slate-300 hover:bg-slate-800"
                                                : "text-slate-600 hover:bg-slate-50"
                                    }
                                `}
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                Dashboard
                            </button>
                        </div>

                        {/* NAVIGATION */}
                        <nav className="mt-7 flex-1 px-4">
                            {navSections.map(
                                (section) => (
                                    <div
                                        key={section.label}
                                        className="mb-7"
                                    >
                                        <p
                                            className={`
                                                mb-3 px-2
                                                text-[10px]
                                                font-semibold
                                                tracking-[0.14em]
                                                ${
                                                    dark
                                                        ? "text-slate-500"
                                                        : "text-slate-400"
                                                }
                                            `}
                                        >
                                            {section.label}
                                        </p>

                                        <div className="space-y-1">
                                            {section.items.map(
                                                (item) => {
                                                    const Icon =
                                                        item.icon;

                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(
                                                                    item.id,
                                                                )
                                                            }
                                                            className={`
                                                                flex w-full
                                                                items-center
                                                                gap-3
                                                                rounded-xl
                                                                px-3 py-3
                                                                text-sm
                                                                transition
                                                                ${
                                                                    activeTab ===
                                                                    item.id
                                                                        ? "bg-blue-50 text-blue-600"
                                                                        : dark
                                                                            ? "text-slate-300 hover:bg-slate-800"
                                                                            : "text-slate-600 hover:bg-slate-50"
                                                                }
                                                            `}
                                                        >
                                                            <Icon className="h-[18px] w-[18px]" />
                                                            {item.label}
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </nav>

                        {/* USER */}
                        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                            <div
                                className={`
                                    flex items-center gap-3
                                    rounded-xl p-3
                                    ${
                                        dark
                                            ? "bg-slate-900"
                                            : "bg-slate-50"
                                    }
                                `}
                            >
                                <div
                                    className="
                                        flex h-9 w-9
                                        items-center justify-center
                                        rounded-full
                                        bg-blue-600
                                        text-sm font-bold text-white
                                    "
                                >
                                    A
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold">
                                        admin@portfolio.dev
                                    </p>

                                    <p
                                        className={`
                                            text-[11px]
                                            ${
                                                dark
                                                    ? "text-slate-500"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Administrator
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("dashboard")
                                }
                                className={`
                                    mt-2 flex w-full
                                    items-center gap-2
                                    rounded-xl px-3 py-2
                                    text-xs
                                    ${
                                        dark
                                            ? "text-slate-400 hover:bg-slate-800"
                                            : "text-slate-500 hover:bg-slate-100"
                                    }
                                `}
                            >
                                <ChevronRight className="h-4 w-4 rotate-180" />
                                Collapse
                            </button>
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <div className="min-w-0 flex-1">

                    {/* TOP BAR */}
                    <header
                        className={`
                            sticky top-0 z-30
                            border-b backdrop-blur-xl
                            ${
                                dark
                                    ? "border-slate-800 bg-[#07111f]/90"
                                    : "border-slate-200 bg-white/90"
                            }
                        `}
                    >
                        <div className="flex h-[76px] items-center justify-between px-5 sm:px-8">

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenu(true)
                                }
                                className="rounded-lg p-2 lg:hidden"
                            >
                                <LayoutDashboard className="h-5 w-5" />
                            </button>

                            <div className="hidden lg:block">
                                <p className="text-xs font-medium text-slate-400">
                                    PORTFOLIO CONTROL CENTER
                                </p>
                            </div>

                            <div className="ml-auto flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setDark(
                                            (value) => !value,
                                        )
                                    }
                                    className={`
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl border
                                        transition
                                        ${
                                            dark
                                                ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                                                : "border-slate-200 bg-white hover:bg-slate-50"
                                        }
                                    `}
                                    aria-label="Toggle theme"
                                >
                                    {dark ? (
                                        <Sun className="h-4 w-4 text-amber-400" />
                                    ) : (
                                        <Moon className="h-4 w-4 text-slate-700" />
                                    )}
                                </button>

                                <a
                                    href="/"
                                    className={`
                                        hidden sm:flex
                                        items-center gap-2
                                        rounded-xl border
                                        px-4 py-2.5
                                        text-sm font-medium
                                        ${
                                            dark
                                                ? "border-slate-700 hover:bg-slate-800"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </a>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/admin/login",
                                        )
                                    }
                                    className={`
                                        rounded-xl border
                                        px-4 py-2.5
                                        text-sm font-medium
                                        ${
                                            dark
                                                ? "border-slate-700 hover:bg-slate-800"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* CONTENT */}
                    <div className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8">

                        {/* NOTICE */}
                        {notice && (
                            <div
                                className={`
                                    mb-6 flex items-center
                                    justify-between gap-4
                                    rounded-xl border
                                    px-4 py-3 text-sm
                                    ${
                                        notice.type ===
                                        "success"
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                            : "border-red-200 bg-red-50 text-red-700"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {notice.type ===
                                    "success" ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <Activity className="h-4 w-4" />
                                    )}

                                    {notice.text}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setNotice(null)
                                    }
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {activeTab === "dashboard" && (
                            <DashboardView
                                dark={dark}
                                skills={skills}
                                projects={projects}
                                recentProjects={recentProjects}
                                navigate={navigate}
                                setShowAllProjects={
                                    setShowAllProjects
                                }
                                showAllProjects={
                                    showAllProjects
                                }
                            />
                        )}

                        {activeTab === "skills" && (
                            <SkillsView
                                dark={dark}
                                skills={filteredSkills}
                                search={skillSearch}
                                setSearch={
                                    setSkillSearch
                                }
                                createSkillAction={
                                    createSkillAction
                                }
                                updateSkillAction={
                                    updateSkillAction
                                }
                                deleteSkillAction={
                                    deleteSkillAction
                                }
                                runAction={runAction}
                            />
                        )}

                        {activeTab === "projects" && (
                            <ProjectsView
                                dark={dark}
                                projects={
                                    filteredProjects
                                }
                                search={projectSearch}
                                setSearch={
                                    setProjectSearch
                                }
                                createProjectAction={
                                    createProjectAction
                                }
                                updateProjectAction={
                                    updateProjectAction
                                }
                                deleteProjectAction={
                                    deleteProjectAction
                                }
                                runAction={runAction}
                            />
                        )}

                        {activeTab === "profile" && (
                            <ComingSoon
                                title="Profile"
                                description="Manage your public portfolio profile and the information used by your AI assistant."
                                icon={UserRound}
                            />
                        )}

                        {activeTab === "experience" && (
                            <ComingSoon
                                title="Experience"
                                description="Add your professional work history so visitors and the AI assistant can understand your background."
                                icon={BriefcaseBusiness}
                            />
                        )}

                        {activeTab === "assistant" && (
                            <ComingSoon
                                title="AI Assistant Data"
                                description="Manage the information your portfolio assistant uses when answering potential clients."
                                icon={Bot}
                            />
                        )}

                        {activeTab === "settings" && (
                            <ComingSoon
                                title="Settings"
                                description="Portfolio administration settings will appear here."
                                icon={Settings}
                            />
                        )}

                        {/* FOOTER */}
                        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
                            <span>
                                © 2024 Flunco Ruiz. All
                                rights reserved.
                            </span>

                            <span>
                                Portfolio Admin v1.0.0
                            </span>
                        </footer>
                    </div>
                </div>
            </div>
        </main>
    );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardView({
    dark,
    skills,
    projects,
    recentProjects,
    navigate,
    setShowAllProjects,
    showAllProjects,
}: {
    dark: boolean;
    skills: Skill[];
    projects: Project[];
    recentProjects: Project[];
    navigate: (tab: Tab) => void;
    setShowAllProjects: (
        value: boolean,
    ) => void;
    showAllProjects: boolean;
}) {
    const panel =
        dark
            ? "border-slate-800 bg-[#0c192b]"
            : "border-slate-200 bg-white";

    return (
        <>

            {/* HERO */}
            <section className="mb-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                            ADMIN
                        </p>

                        <h1
                            className={`
                                text-3xl font-bold tracking-tight
                                sm:text-4xl
                                ${
                                    dark
                                        ? "text-white"
                                        : "text-slate-950"
                                }
                            `}
                        >
                            Welcome back, Admin! 👋
                        </h1>

                        <p
                            className={`
                                mt-2
                                ${
                                    dark
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            Manage your portfolio and keep
                            your data up to date.
                        </p>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    dark={dark}
                    icon={BriefcaseBusiness}
                    label="PROJECTS"
                    value={projects.length}
                    description="Total projects"
                    change="+12%"
                    color="blue"
                />

                <StatCard
                    dark={dark}
                    icon={Code2}
                    label="SKILLS"
                    value={skills.length}
                    description="Total skills"
                    change="+5%"
                    color="blue"
                />

                <StatCard
                    dark={dark}
                    icon={UserRound}
                    label="EXPERIENCE"
                    value={0}
                    description="Experiences"
                    change="No change"
                    color="purple"
                />

                <StatCard
                    dark={dark}
                    icon={BarChart3}
                    label="PROFILE VIEWS"
                    value="1,248"
                    description="Total views"
                    change="+23%"
                    color="purple"
                />

            </section>

            {/* BLUE HERO CARD */}
            <section
                className="
                    relative mb-6
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    via-blue-600
                    to-blue-500
                    p-7
                    text-white
                    shadow-xl
                    shadow-blue-500/20
                "
            >
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

                <div className="absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                <div className="relative max-w-xl">
                    <div className="mb-4 flex items-center gap-2 text-white/80">
                        <Sparkles className="h-4 w-4" />
                        Portfolio status
                    </div>

                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Your portfolio is looking great! ✨
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-blue-100">
                        Keep it updated to make the best
                        impression on potential clients.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                            href="/"
                            className="
                                inline-flex
                                items-center gap-2
                                rounded-xl
                                bg-white
                                px-5 py-3
                                text-sm font-semibold
                                text-blue-600
                                shadow-lg
                                transition
                                hover:-translate-y-0.5
                            "
                        >
                            View Public Site
                            <ExternalLink className="h-4 w-4" />
                        </a>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("profile")
                            }
                            className="
                                rounded-xl
                                border border-white/60
                                px-5 py-3
                                text-sm font-semibold
                                text-white
                                transition
                                hover:bg-white/10
                            "
                        >
                            Manage Profile
                        </button>
                    </div>
                </div>
            </section>

            {/* TWO COLUMNS */}
            <section className="grid gap-6 xl:grid-cols-[310px_minmax(0,1fr)]">

                {/* QUICK ACTIONS */}
                <div
                    className={`
                        rounded-2xl border p-5
                        ${panel}
                    `}
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">
                        QUICK ACTIONS
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                        Jump to the important sections.
                    </h2>

                    <div className="mt-5 space-y-3">

                        <QuickAction
                            dark={dark}
                            icon={UserRound}
                            title="Edit Profile"
                            text="Update your personal information"
                            onClick={() =>
                                navigate("profile")
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={Code2}
                            title="Manage Skills"
                            text="Add or remove your skills"
                            onClick={() =>
                                navigate("skills")
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={BriefcaseBusiness}
                            title="Manage Projects"
                            text="Add or edit your projects"
                            onClick={() =>
                                navigate("projects")
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={Users}
                            title="Manage Experience"
                            text="Add or edit your work history"
                            onClick={() =>
                                navigate("experience")
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={Bot}
                            title="AI Assistant Data"
                            text="Manage chatbot knowledge"
                            onClick={() =>
                                navigate("assistant")
                            }
                        />

                    </div>
                </div>

                {/* RECENT PROJECTS */}
                <div
                    className={`
                        overflow-hidden
                        rounded-2xl border
                        ${panel}
                    `}
                >
                    <div className="flex items-center justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">
                                PORTFOLIO
                            </p>

                            <h2 className="mt-2 text-xl font-bold">
                                Recent Projects
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your latest projects
                            </p>
                        </div>

                        {projects.length > 5 && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowAllProjects(
                                        !showAllProjects,
                                    )
                                }
                                className="
                                    hidden rounded-xl
                                    border border-slate-200
                                    px-4 py-2
                                    text-xs font-medium
                                    text-blue-600
                                    transition
                                    hover:bg-blue-50
                                    sm:block
                                "
                            >
                                {showAllProjects
                                    ? "Show less"
                                    : "View all projects"}
                            </button>
                        )}
                    </div>

                    <div>
                        {recentProjects.length === 0 ? (
                            <div className="p-10 text-center text-sm text-slate-500">
                                No projects yet.
                            </div>
                        ) : (
                            recentProjects.map(
                                (project) => (
                                    <ProjectRow
                                        key={project.id}
                                        dark={dark}
                                        project={project}
                                    />
                                ),
                            )
                        )}
                    </div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section
                className={`
                    mt-6 rounded-2xl border p-7
                    ${panel}
                `}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-500">
                            CAREER
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Experience
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your work history
                        </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        0 items
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center py-12 text-center">

                    <div
                        className="
                            flex h-14 w-14
                            items-center justify-center
                            rounded-full
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <BriefcaseBusiness className="h-6 w-6" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                        No experience added yet
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Add your work history to help the AI
                        assistant provide better answers about
                        your background.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("experience")
                        }
                        className="
                            mt-5
                            inline-flex
                            items-center gap-2
                            rounded-xl
                            bg-blue-600
                            px-5 py-3
                            text-sm font-semibold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition
                            hover:bg-blue-700
                        "
                    >
                        <Plus className="h-4 w-4" />
                        Add Experience
                    </button>
                </div>
            </section>
        </>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    dark,
    icon: Icon,
    label,
    value,
    description,
    change,
    color,
}: {
    dark: boolean;
    icon: typeof Code2;
    label: string;
    value: string | number;
    description: string;
    change: string;
    color: "blue" | "purple";
}) {
    return (
        <div
            className={`
                rounded-2xl border p-5
                ${
                    dark
                        ? "border-slate-800 bg-[#0c192b]"
                        : "border-slate-200 bg-white"
                }
            `}
        >
            <div className="flex items-start justify-between">
                <div
                    className={`
                        flex h-11 w-11
                        items-center justify-center
                        rounded-xl
                        ${
                            color === "blue"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-purple-50 text-purple-600"
                        }
                    `}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <span className="text-[10px] font-semibold tracking-wider text-slate-400">
                    {label}
                </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
                {value}
            </p>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs">
                {change.includes("+") ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                        <ArrowUpRight className="h-3 w-3" />
                        {change}
                    </span>
                ) : (
                    <span className="text-slate-400">
                        — {change}
                    </span>
                )}

                {change.includes("+") && (
                    <span className="text-slate-400">
                        this month
                    </span>
                )}
            </div>
        </div>
    );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
    dark,
    icon: Icon,
    title,
    text,
    onClick,
}: {
    dark: boolean;
    icon: typeof Code2;
    title: string;
    text: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group flex w-full
                items-center gap-3
                rounded-xl border
                p-3
                text-left
                transition
                ${
                    dark
                        ? "border-slate-800 hover:border-blue-500/40 hover:bg-slate-900"
                        : "border-slate-200 hover:border-blue-200 hover:bg-blue-50/40"
                }
            `}
        >
            <div
                className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                "
            >
                <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                    {title}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                    {text}
                </p>
            </div>

            <ChevronRight
                className="
                    h-4 w-4
                    text-slate-400
                    transition
                    group-hover:translate-x-1
                "
            />
        </button>
    );
}

/* =========================================================
   PROJECT ROW
========================================================= */

function ProjectRow({
    dark,
    project,
}: {
    dark: boolean;
    project: Project;
}) {
    const tags = project.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div
            className={`
                flex gap-4
                border-b
                p-4
                last:border-b-0
                ${
                    dark
                        ? "border-slate-800"
                        : "border-slate-100"
                }
            `}
        >
            <div
                className="
                    h-20 w-20
                    shrink-0
                    overflow-hidden
                    rounded-xl
                    bg-slate-100
                "
            >
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <Code2 className="h-7 w-7" />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold">
                            {project.title}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-500">
                            {project.summary}
                        </p>
                    </div>

                    <span className="hidden shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600 sm:block">
                        {project.status}
                    </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={`
                                rounded-md border
                                px-2 py-1
                                text-[9px]
                                font-medium
                                uppercase
                                ${
                                    dark
                                        ? "border-slate-700 text-slate-400"
                                        : "border-slate-200 text-slate-500"
                                }
                            `}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="hidden items-start md:flex">
                <button
                    type="button"
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label={`Actions for ${project.title}`}
                >
                    •••
                </button>
            </div>
        </div>
    );
}

/* =========================================================
   SKILLS VIEW
========================================================= */

function SkillsView({
    dark,
    skills,
    search,
    setSearch,
    createSkillAction,
    updateSkillAction,
    deleteSkillAction,
    runAction,
}: {
    dark: boolean;
    skills: Skill[];
    search: string;
    setSearch: (value: string) => void;
    createSkillAction: (
        formData: FormData,
    ) => Promise<unknown>;
    updateSkillAction: (
        formData: FormData,
    ) => Promise<unknown>;
    deleteSkillAction: (
        formData: FormData,
    ) => Promise<unknown>;
    runAction: (
        action: (
            formData: FormData,
        ) => Promise<unknown>,
        formData: FormData,
        successText: string,
    ) => Promise<void>;
}) {
    const [showCreate, setShowCreate] =
        useState(false);

    return (
        <section>
            <PageHeader
                dark={dark}
                eyebrow="CONTENT"
                title="Skills"
                description="Manage the technologies and capabilities shown on your portfolio."
                count={`${skills.length} skills`}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <input
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value,
                        )
                    }
                    placeholder="Search skills..."
                    className={`
                        flex-1 rounded-xl border
                        px-4 py-3 text-sm outline-none
                        ${
                            dark
                                ? "border-slate-700 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }
                    `}
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowCreate(
                            !showCreate,
                        )
                    }
                    className="
                        inline-flex items-center
                        justify-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-sm font-semibold
                        text-white
                    "
                >
                    <Plus className="h-4 w-4" />
                    Add Skill
                </button>
            </div>

            {showCreate && (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        void runAction(
                            createSkillAction,
                            new FormData(
                                event.currentTarget,
                            ),
                            "Skill created successfully.",
                        );

                        event.currentTarget.reset();
                        setShowCreate(false);
                    }}
                    className={`
                        mb-5 grid gap-3 rounded-2xl
                        border p-4
                        sm:grid-cols-[1fr_1fr_100px_auto]
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c192b]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <input
                        name="name"
                        placeholder="Skill name"
                        required
                        className="admin-input"
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        required
                        className="admin-input"
                    />

                    <input
                        name="order"
                        type="number"
                        defaultValue={0}
                        min={0}
                        className="admin-input"
                    />

                    <button
                        type="submit"
                        className="
                            rounded-xl
                            bg-blue-600
                            px-5 py-2
                            text-sm font-semibold
                            text-white
                        "
                    >
                        Add
                    </button>
                </form>
            )}

            <div
                className={`
                    overflow-hidden rounded-2xl border
                    ${
                        dark
                            ? "border-slate-800 bg-[#0c192b]"
                            : "border-slate-200 bg-white"
                    }
                `}
            >
                {skills.map((skill) => (
                    <form
                        key={skill.id}
                        onSubmit={(event) => {
                            event.preventDefault();

                            void runAction(
                                updateSkillAction,
                                new FormData(
                                    event.currentTarget,
                                ),
                                `${skill.name} updated.`,
                            );
                        }}
                        className="grid gap-3 border-b border-slate-200 p-4 last:border-0 dark:border-slate-800 sm:grid-cols-[1.5fr_1fr_90px_auto]"
                    >
                        <input
                            type="hidden"
                            name="id"
                            value={skill.id}
                        />

                        <input
                            name="name"
                            defaultValue={
                                skill.name
                            }
                            className="admin-input"
                            required
                        />

                        <input
                            name="category"
                            defaultValue={
                                skill.category
                            }
                            className="admin-input"
                            required
                        />

                        <input
                            name="order"
                            type="number"
                            min={0}
                            defaultValue={
                                skill.order
                            }
                            className="admin-input"
                        />

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    border border-blue-200
                                    bg-blue-50
                                    text-blue-600
                                "
                                aria-label="Save skill"
                            >
                                <PencilLine className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={(event) => {
                                    const form =
                                        event.currentTarget
                                            .form;

                                    if (!form) return;

                                    if (
                                        !window.confirm(
                                            `Delete ${skill.name}?`,
                                        )
                                    ) {
                                        return;
                                    }

                                    void runAction(
                                        deleteSkillAction,
                                        new FormData(
                                            form,
                                        ),
                                        `${skill.name} deleted.`,
                                    );
                                }}
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    bg-slate-700
                                    text-white
                                "
                                aria-label="Delete skill"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                ))}
            </div>
        </section>
    );
}

/* =========================================================
   PROJECTS VIEW
========================================================= */

function ProjectsView({
    dark,
    projects,
    search,
    setSearch,
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    runAction,
}: {
    dark: boolean;
    projects: Project[];
    search: string;
    setSearch: (value: string) => void;
    createProjectAction: (
        formData: FormData,
    ) => Promise<unknown>;
    updateProjectAction: (
        formData: FormData,
    ) => Promise<unknown>;
    deleteProjectAction: (
        formData: FormData,
    ) => Promise<unknown>;
    runAction: (
        action: (
            formData: FormData,
        ) => Promise<unknown>,
        formData: FormData,
        successText: string,
    ) => Promise<void>;
}) {
    const [showCreate, setShowCreate] =
        useState(false);

    return (
        <section>
            <PageHeader
                dark={dark}
                eyebrow="PORTFOLIO"
                title="Projects"
                description="Manage your portfolio projects, descriptions, links and featured status."
                count={`${projects.length} projects`}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <input
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value,
                        )
                    }
                    placeholder="Search projects..."
                    className={`
                        flex-1 rounded-xl border
                        px-4 py-3 text-sm outline-none
                        ${
                            dark
                                ? "border-slate-700 bg-slate-900"
                                : "border-slate-200 bg-white"
                        }
                    `}
                />

                <button
                    type="button"
                    onClick={() =>
                        setShowCreate(
                            !showCreate,
                        )
                    }
                    className="
                        inline-flex items-center
                        justify-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-sm font-semibold
                        text-white
                    "
                >
                    <Plus className="h-4 w-4" />
                    Add Project
                </button>
            </div>

            {showCreate && (
                <ProjectForm
                    dark={dark}
                    create
                    action={createProjectAction}
                    onSubmit={(formData) => {
                        void runAction(
                            createProjectAction,
                            formData,
                            "Project created successfully.",
                        );

                        setShowCreate(false);
                    }}
                />
            )}

            <div className="space-y-4">
                {projects.map((project) => (
                    <ProjectForm
                        key={project.id}
                        dark={dark}
                        project={project}
                        action={
                            updateProjectAction
                        }
                        deleteAction={
                            deleteProjectAction
                        }
                        onSubmit={(formData) => {
                            void runAction(
                                updateProjectAction,
                                formData,
                                `${project.title} updated.`,
                            );
                        }}
                        onDelete={(formData) => {
                            if (
                                window.confirm(
                                    `Delete ${project.title}?`,
                                )
                            ) {
                                void runAction(
                                    deleteProjectAction,
                                    formData,
                                    `${project.title} deleted.`,
                                );
                            }
                        }}
                    />
                ))}
            </div>
        </section>
    );
}

/* =========================================================
   PROJECT FORM
========================================================= */

function ProjectForm({
    dark,
    project,
    create,
    action,
    deleteAction,
    onSubmit,
    onDelete,
}: {
    dark: boolean;
    project?: Project;
    create?: boolean;
    action: (
        formData: FormData,
    ) => Promise<unknown>;
    deleteAction?: (
        formData: FormData,
    ) => Promise<unknown>;
    onSubmit: (
        formData: FormData,
    ) => void;
    onDelete?: (
        formData: FormData,
    ) => void;
}) {
    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();

                onSubmit(
                    new FormData(
                        event.currentTarget,
                    ),
                );
            }}
            className={`
                rounded-2xl border p-5
                ${
                    dark
                        ? "border-slate-800 bg-[#0c192b]"
                        : "border-slate-200 bg-white"
                }
            `}
        >
            {project && (
                <input
                    type="hidden"
                    name="id"
                    value={project.id}
                />
            )}

            <div className="grid gap-3 md:grid-cols-2">

                <input
                    name="title"
                    defaultValue={
                        project?.title
                    }
                    placeholder="Project title"
                    required
                    className="admin-input"
                />

                <input
                    name="slug"
                    defaultValue={
                        project?.slug
                    }
                    placeholder="Slug"
                    required
                    className="admin-input"
                />

                <input
                    name="url"
                    defaultValue={
                        project?.url ?? ""
                    }
                    placeholder="Project URL"
                    className="admin-input"
                />

                <input
                    name="githubUrl"
                    defaultValue={
                        project?.githubUrl ?? ""
                    }
                    placeholder="GitHub URL"
                    className="admin-input"
                />

                <input
                    name="imageUrl"
                    defaultValue={
                        project?.imageUrl ?? ""
                    }
                    placeholder="Image URL"
                    className="admin-input md:col-span-2"
                />

                <input
                    name="tags"
                    defaultValue={
                        project?.tags ?? ""
                    }
                    placeholder="NEXT.JS, REACT, SAAS"
                    className="admin-input md:col-span-2"
                />

                <input
                    name="status"
                    defaultValue={
                        project?.status ??
                        "active"
                    }
                    placeholder="Status"
                    className="admin-input"
                />

                <label
                    className="
                        flex items-center gap-3
                        rounded-xl border
                        border-slate-200
                        px-4 py-3
                        text-sm
                    "
                >
                    <input
                        name="featured"
                        type="checkbox"
                        defaultChecked={
                            project?.featured ??
                            false
                        }
                        className="h-4 w-4 accent-blue-600"
                    />

                    Featured project
                </label>

                <textarea
                    name="summary"
                    defaultValue={
                        project?.summary
                    }
                    placeholder="Short summary"
                    required
                    rows={3}
                    className="admin-input resize-none md:col-span-2"
                />

                <textarea
                    name="description"
                    defaultValue={
                        project?.description
                    }
                    placeholder="Full project description"
                    required
                    rows={5}
                    className="admin-input resize-none md:col-span-2"
                />
            </div>

            <div className="mt-4 flex justify-end gap-2">
                {project &&
                    deleteAction &&
                    onDelete && (
                        <button
                            type="button"
                            onClick={(event) => {
                                const form =
                                    event.currentTarget
                                        .form;

                                if (!form) return;

                                onDelete(
                                    new FormData(
                                        form,
                                    ),
                                );
                            }}
                            className="
                                flex items-center gap-2
                                rounded-xl
                                bg-slate-700
                                px-4 py-2.5
                                text-sm font-medium
                                text-white
                            "
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    )}

                <button
                    type="submit"
                    className="
                        flex items-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-2.5
                        text-sm font-semibold
                        text-white
                        shadow-lg
                        shadow-blue-500/20
                    "
                >
                    {create ? (
                        <>
                            <Plus className="h-4 w-4" />
                            Create Project
                        </>
                    ) : (
                        <>
                            <PencilLine className="h-4 w-4" />
                            Save Project
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
    dark,
    eyebrow,
    title,
    description,
    count,
}: {
    dark: boolean;
    eyebrow: string;
    title: string;
    description: string;
    count: string;
}) {
    return (
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
                    {eyebrow}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    {description}
                </p>
            </div>

            <span
                className={`
                    w-fit rounded-full
                    px-3 py-1.5
                    text-xs font-medium
                    ${
                        dark
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-blue-50 text-blue-600"
                    }
                `}
            >
                {count}
            </span>
        </div>
    );
}

/* =========================================================
   COMING SOON
========================================================= */

function ComingSoon({
    title,
    description,
    icon: Icon,
}: {
    title: string;
    description: string;
    icon: typeof Code2;
}) {
    return (
        <section
            className="
                flex min-h-[500px]
                items-center
                justify-center
            "
        >
            <div className="max-w-lg text-center">
                <div
                    className="
                        mx-auto
                        flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <Icon className="h-7 w-7" />
                </div>

                <h1 className="mt-6 text-3xl font-bold">
                    {title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    {description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Section ready for implementation
                </div>
            </div>
        </section>
    );
}