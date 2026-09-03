"use client";

import { useRouter } from "next/navigation";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Bell,
    Bot,
    BriefcaseBusiness,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Code2,
    Command,
    ExternalLink,
    FileText,
    // Github,
    Globe2,
    Home,
    LayoutDashboard,
    Menu,
    Moon,
    MoreHorizontal,
    PencilLine,
    Plus,
    Search,
    Settings,
    ShieldCheck,
    Sparkles,
    Sun,
    Trash2,
    UserRound,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

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

type Experience = {
    id: number;
    company: string;
    position: string;
    location?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    description?: string | null;
};

type Profile = {
    name?: string;
    headline?: string;
    bio?: string;
    location?: string;
    email?: string;
    website?: string;
    github?: string;
    linkedin?: string;
    avatarUrl?: string;
};

type AdminDashboardProps = {
    skills: Skill[];
    projects: Project[];

    /*
     * Optional profile / experience data.
     * Keeping these optional means your current parent component
     * does not need to change immediately.
     */
    profile?: Profile | null;
    experiences?: Experience[];

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

    /*
     * Optional profile / experience actions.
     * They can be connected to your existing server actions later.
     */
    updateProfileAction?: (
        formData: FormData,
    ) => Promise<unknown>;

    createExperienceAction?: (
        formData: FormData,
    ) => Promise<unknown>;

    updateExperienceAction?: (
        formData: FormData,
    ) => Promise<unknown>;

    deleteExperienceAction?: (
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

type Theme = "light" | "dark";

export function AdminDashboard({
    skills,
    projects,
    profile,
    experiences = [],
    createSkillAction,
    updateSkillAction,
    deleteSkillAction,
    createProjectAction,
    updateProjectAction,
    deleteProjectAction,
    updateProfileAction,
    createExperienceAction,
    updateExperienceAction,
    deleteExperienceAction,
}: AdminDashboardProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] =
        useState<Tab>("dashboard");

    const [theme, setTheme] =
        useState<Theme>("light");

    const dark = theme === "dark";

    const [mobileMenu, setMobileMenu] =
        useState(false);

    const [notice, setNotice] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [skillSearch, setSkillSearch] =
        useState("");

    const [projectSearch, setProjectSearch] =
        useState("");

    const [showAllProjects, setShowAllProjects] =
        useState(false);

    const [commandOpen, setCommandOpen] =
        useState(false);

    async function runAction(
        action:
            | ((formData: FormData) => Promise<unknown>)
            | undefined,
        formData: FormData,
        successText: string,
    ) {
        if (!action) {
            setNotice({
                type: "error",
                text: "This action is not connected yet.",
            });

            return;
        }

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

        if (!query) return skills;

        return skills.filter((skill) =>
            `${skill.name} ${skill.category}`
                .toLowerCase()
                .includes(query),
        );
    }, [skills, skillSearch]);

    const filteredProjects = useMemo(() => {
        const query =
            projectSearch.trim().toLowerCase();

        if (!query) return projects;

        return projects.filter((project) =>
            `${project.title} ${project.tags} ${project.summary}`
                .toLowerCase()
                .includes(query),
        );
    }, [projects, projectSearch]);

    const recentProjects = showAllProjects
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
            label: "CONTENT",
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
                    id: "assistant" as Tab,
                    label: "AI Assistant",
                    icon: Bot,
                },
                {
                    id: "settings" as Tab,
                    label: "Settings",
                    icon: Settings,
                },
            ],
        },
    ];

    return (
        <main
            className={
                dark
                    ? "min-h-screen bg-[#070d17] text-slate-100"
                    : "min-h-screen bg-[#f6f8fc] text-slate-900"
            }
        >
            <div className="flex min-h-screen">

                {/* MOBILE OVERLAY */}
                {mobileMenu && (
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() =>
                            setMobileMenu(false)
                        }
                        className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50
                        w-[278px]
                        transform
                        border-r
                        transition-transform duration-300
                        lg:sticky
                        lg:top-0
                        lg:h-screen
                        lg:translate-x-0
                        ${
                            mobileMenu
                                ? "translate-x-0"
                                : "-translate-x-full"
                        }
                        ${
                            dark
                                ? "border-slate-800 bg-[#0b1320]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <div className="flex h-full flex-col">

                        {/* BRAND */}
                        <div
                            className={`
                                flex items-center gap-3
                                border-b px-6 py-6
                                ${
                                    dark
                                        ? "border-slate-800"
                                        : "border-slate-100"
                                }
                            `}
                        >
                            <div
                                className="
                                    relative flex h-11 w-11
                                    shrink-0 items-center
                                    justify-center rounded-2xl
                                    bg-gradient-to-br
                                    from-blue-600 to-indigo-600
                                    text-lg font-black text-white
                                    shadow-lg shadow-blue-600/20
                                "
                            >
                                F

                                <span
                                    className="
                                        absolute -right-1 -top-1
                                        h-3 w-3 rounded-full
                                        border-2 border-white
                                        bg-emerald-400
                                    "
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold tracking-wide">
                                    FLUNCO RUIZ
                                </p>

                                <p
                                    className={`
                                        mt-0.5 text-[11px]
                                        ${
                                            dark
                                                ? "text-slate-500"
                                                : "text-slate-400"
                                        }
                                    `}
                                >
                                    Portfolio Control Center
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenu(false)
                                }
                                className="ml-auto rounded-lg p-2 lg:hidden"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* STATUS */}
                        <div className="px-5 pt-5">
                            <div
                                className={`
                                    flex items-center gap-2
                                    rounded-xl border px-3 py-2.5
                                    ${
                                        dark
                                            ? "border-emerald-500/10 bg-emerald-500/5"
                                            : "border-emerald-100 bg-emerald-50/70"
                                    }
                                `}
                            >
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                </span>

                                <span
                                    className={`
                                        text-[11px] font-medium
                                        ${
                                            dark
                                                ? "text-emerald-400"
                                                : "text-emerald-700"
                                        }
                                    `}
                                >
                                    Portfolio online
                                </span>
                            </div>
                        </div>

                        {/* NAV */}
                        <nav className="mt-6 flex-1 overflow-y-auto px-4">
                            <SidebarButton
                                dark={dark}
                                active={
                                    activeTab ===
                                    "dashboard"
                                }
                                icon={LayoutDashboard}
                                label="Dashboard"
                                onClick={() =>
                                    navigate(
                                        "dashboard",
                                    )
                                }
                            />

                            {navSections.map(
                                (section) => (
                                    <div
                                        key={
                                            section.label
                                        }
                                        className="mt-7"
                                    >
                                        <p
                                            className={`
                                                mb-2 px-3
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.18em]
                                                ${
                                                    dark
                                                        ? "text-slate-600"
                                                        : "text-slate-400"
                                                }
                                            `}
                                        >
                                            {
                                                section.label
                                            }
                                        </p>

                                        <div className="space-y-1">
                                            {section.items.map(
                                                (
                                                    item,
                                                ) => {
                                                    const Icon =
                                                        item.icon;

                                                    return (
                                                        <SidebarButton
                                                            key={
                                                                item.id
                                                            }
                                                            dark={
                                                                dark
                                                            }
                                                            active={
                                                                activeTab ===
                                                                item.id
                                                            }
                                                            icon={
                                                                Icon
                                                            }
                                                            label={
                                                                item.label
                                                            }
                                                            onClick={() =>
                                                                navigate(
                                                                    item.id,
                                                                )
                                                            }
                                                            badge={
                                                                item.id ===
                                                                "assistant"
                                                                    ? "AI"
                                                                    : undefined
                                                            }
                                                        />
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </nav>

                        {/* SIDEBAR BOTTOM */}
                        <div
                            className={`
                                border-t p-4
                                ${
                                    dark
                                        ? "border-slate-800"
                                        : "border-slate-100"
                                }
                            `}
                        >
                            <div
                                className={`
                                    rounded-2xl p-3
                                    ${
                                        dark
                                            ? "bg-slate-900/70"
                                            : "bg-slate-50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            flex h-9 w-9
                                            shrink-0
                                            items-center justify-center
                                            rounded-xl
                                            bg-gradient-to-br
                                            from-blue-500
                                            to-indigo-600
                                            text-xs font-bold
                                            text-white
                                        "
                                    >
                                        A
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold">
                                            Administrator
                                        </p>

                                        <p
                                            className={`
                                                mt-0.5 truncate
                                                text-[10px]
                                                ${
                                                    dark
                                                        ? "text-slate-500"
                                                        : "text-slate-400"
                                                }
                                            `}
                                        >
                                            admin@portfolio.dev
                                        </p>
                                    </div>

                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN AREA */}
                <div className="min-w-0 flex-1">

                    {/* TOP HEADER */}
                    <header
                        className={`
                            sticky top-0 z-30
                            border-b backdrop-blur-2xl
                            ${
                                dark
                                    ? "border-slate-800/80 bg-[#070d17]/85"
                                    : "border-slate-200/80 bg-white/85"
                            }
                        `}
                    >
                        <div className="flex h-[72px] items-center gap-4 px-5 sm:px-8">

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenu(true)
                                }
                                className={`
                                    rounded-xl p-2.5
                                    lg:hidden
                                    ${
                                        dark
                                            ? "hover:bg-slate-800"
                                            : "hover:bg-slate-100"
                                    }
                                `}
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* BREADCRUMB */}
                            <div className="hidden min-w-0 items-center gap-2 md:flex">
                                <span
                                    className={
                                        dark
                                            ? "text-slate-500"
                                            : "text-slate-400"
                                    }
                                >
                                    Admin
                                </span>

                                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

                                <span className="font-medium">
                                    {tabTitle(activeTab)}
                                </span>
                            </div>

                            {/* SEARCH */}
                            <button
                                type="button"
                                onClick={() =>
                                    setCommandOpen(true)
                                }
                                className={`
                                    ml-auto hidden
                                    h-10 w-[230px]
                                    items-center gap-2
                                    rounded-xl border
                                    px-3 text-left
                                    text-xs
                                    lg:flex
                                    ${
                                        dark
                                            ? "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700"
                                            : "border-slate-200 bg-slate-50/80 text-slate-400 hover:border-slate-300"
                                    }
                                `}
                            >
                                <Search className="h-4 w-4" />

                                <span className="flex-1">
                                    Quick search...
                                </span>

                                <span
                                    className={`
                                        rounded-md border px-1.5 py-0.5
                                        text-[9px]
                                        ${
                                            dark
                                                ? "border-slate-700"
                                                : "border-slate-200"
                                        }
                                    `}
                                >
                                    ⌘ K
                                </span>
                            </button>

                            {/* HEADER ACTIONS */}
                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    aria-label="Notifications"
                                    className={`
                                        relative flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl border
                                        ${
                                            dark
                                                ? "border-slate-800 hover:bg-slate-900"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    <Bell className="h-4 w-4" />

                                    <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setTheme(
                                            dark
                                                ? "light"
                                                : "dark",
                                        )
                                    }
                                    aria-label="Toggle theme"
                                    className={`
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl border
                                        ${
                                            dark
                                                ? "border-slate-800 hover:bg-slate-900"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    {dark ? (
                                        <Sun className="h-4 w-4 text-amber-400" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                </button>

                                <a
                                    href="/"
                                    className={`
                                        hidden h-10
                                        items-center gap-2
                                        rounded-xl border
                                        px-3.5
                                        text-xs font-semibold
                                        sm:flex
                                        ${
                                            dark
                                                ? "border-slate-800 hover:bg-slate-900"
                                                : "border-slate-200 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    <Globe2 className="h-3.5 w-3.5" />
                                    View site
                                </a>

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/admin/login",
                                        )
                                    }
                                    className="
                                        hidden h-10
                                        rounded-xl
                                        bg-slate-900
                                        px-4 text-xs
                                        font-semibold text-white
                                        hover:bg-slate-800
                                        sm:block
                                    "
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* PAGE */}
                    <div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 lg:py-9">

                        {/* NOTICE */}
                        {notice && (
                            <Notice
                                notice={notice}
                                onClose={() =>
                                    setNotice(null)
                                }
                                dark={dark}
                            />
                        )}

                        {activeTab ===
                            "dashboard" && (
                            <DashboardView
                                dark={dark}
                                skills={skills}
                                projects={projects}
                                experiences={
                                    experiences
                                }
                                recentProjects={
                                    recentProjects
                                }
                                navigate={navigate}
                                setShowAllProjects={
                                    setShowAllProjects
                                }
                                showAllProjects={
                                    showAllProjects
                                }
                            />
                        )}

                        {activeTab === "profile" && (
                            <ProfileView
                                dark={dark}
                                profile={profile}
                                action={
                                    updateProfileAction
                                }
                                runAction={
                                    runAction
                                }
                            />
                        )}

                        {activeTab === "skills" && (
                            <SkillsView
                                dark={dark}
                                skills={
                                    filteredSkills
                                }
                                search={
                                    skillSearch
                                }
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
                                runAction={
                                    runAction
                                }
                            />
                        )}

                        {activeTab === "projects" && (
                            <ProjectsView
                                dark={dark}
                                projects={
                                    filteredProjects
                                }
                                search={
                                    projectSearch
                                }
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
                                runAction={
                                    runAction
                                }
                            />
                        )}

                        {activeTab ===
                            "experience" && (
                            <ExperienceView
                                dark={dark}
                                experiences={
                                    experiences
                                }
                                createAction={
                                    createExperienceAction
                                }
                                updateAction={
                                    updateExperienceAction
                                }
                                deleteAction={
                                    deleteExperienceAction
                                }
                                runAction={
                                    runAction
                                }
                            />
                        )}

                        {activeTab ===
                            "assistant" && (
                            <AssistantView
                                dark={dark}
                            />
                        )}

                        {activeTab === "settings" && (
                            <SettingsView
                                dark={dark}
                            />
                        )}

                        {/* FOOTER */}
                        <footer
                            className={`
                                mt-12 flex flex-col
                                gap-2 border-t
                                pt-5 text-[11px]
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                ${
                                    dark
                                        ? "border-slate-800 text-slate-600"
                                        : "border-slate-200 text-slate-400"
                                }
                            `}
                        >
                            <span>
                                © 2026 Flunco Ruiz.
                                All rights reserved.
                            </span>

                            <div className="flex items-center gap-3">
                                <span>
                                    Portfolio Admin
                                    v1.0.0
                                </span>

                                <span className="h-1 w-1 rounded-full bg-slate-300" />

                                <span className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    System operational
                                </span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>

            {/* COMMAND MODAL */}
            {commandOpen && (
                <CommandModal
                    dark={dark}
                    navigate={navigate}
                    onClose={() =>
                        setCommandOpen(false)
                    }
                />
            )}
        </main>
    );
}

/* =========================================================
   SIDEBAR BUTTON
========================================================= */

function SidebarButton({
    dark,
    active,
    icon: Icon,
    label,
    onClick,
    badge,
}: {
    dark: boolean;
    active: boolean;
    icon: typeof Code2;
    label: string;
    onClick: () => void;
    badge?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group flex w-full
                items-center gap-3
                rounded-xl px-3.5 py-2.5
                text-left text-sm
                font-medium
                transition-all
                ${
                    active
                        ? dark
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-blue-50 text-blue-700"
                        : dark
                            ? "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }
            `}
        >
            <Icon
                className={`
                    h-[18px] w-[18px]
                    shrink-0
                    ${
                        active
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600"
                    }
                `}
            />

            <span className="flex-1">
                {label}
            </span>

            {badge && (
                <span
                    className="
                        rounded-md
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        px-1.5 py-0.5
                        text-[8px]
                        font-bold
                        text-white
                    "
                >
                    {badge}
                </span>
            )}

            {active && (
                <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
            )}
        </button>
    );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardView({
    dark,
    skills,
    projects,
    experiences,
    recentProjects,
    navigate,
    setShowAllProjects,
    showAllProjects,
}: {
    dark: boolean;
    skills: Skill[];
    projects: Project[];
    experiences: Experience[];
    recentProjects: Project[];
    navigate: (tab: Tab) => void;
    setShowAllProjects: (
        value: boolean,
    ) => void;
    showAllProjects: boolean;
}) {
    const panel = dark
        ? "border-slate-800 bg-[#0c1524]"
        : "border-slate-200 bg-white";

    const featuredProjects = projects.filter(
        (project) => project.featured,
    ).length;

    return (
        <>
            {/* PAGE INTRO */}
            <section className="mb-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />

                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
                                Admin Dashboard
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome back, Admin.
                        </h1>

                        <p
                            className={`
                                mt-2 max-w-xl text-sm leading-6
                                ${
                                    dark
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            Manage your portfolio,
                            projects, skills and
                            professional profile
                            from one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            className="
                                inline-flex items-center
                                gap-2 rounded-xl
                                border border-slate-200
                                bg-white px-4 py-2.5
                                text-xs font-semibold
                                text-slate-700
                                shadow-sm
                                hover:bg-slate-50
                            "
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Preview portfolio
                        </a>
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
                    description="Portfolio projects"
                    change="+12%"
                    color="blue"
                />

                <StatCard
                    dark={dark}
                    icon={Code2}
                    label="SKILLS"
                    value={skills.length}
                    description="Technical skills"
                    change="+5%"
                    color="indigo"
                />

                <StatCard
                    dark={dark}
                    icon={Users}
                    label="EXPERIENCE"
                    value={experiences.length}
                    description="Career entries"
                    change={
                        experiences.length
                            ? "+1"
                            : "No change"
                    }
                    color="purple"
                />

                <StatCard
                    dark={dark}
                    icon={BarChart3}
                    label="PROFILE VIEWS"
                    value="1,248"
                    description="Portfolio visits"
                    change="+23%"
                    color="emerald"
                />
            </section>

            {/* HERO */}
            <section
                className="
                    relative mb-6
                    overflow-hidden
                    rounded-3xl
                    bg-gradient-to-br
                    from-blue-600
                    via-blue-600
                    to-indigo-600
                    p-7 text-white
                    shadow-2xl
                    shadow-blue-600/15
                    sm:p-9
                "
            >
                <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

                <div className="relative grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-100">
                            <Sparkles className="h-3.5 w-3.5" />
                            Portfolio health
                        </div>

                        <h2 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                            Your portfolio is
                            ready to impress.
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                            Keep your projects,
                            skills and experience
                            updated so potential
                            clients always see your
                            best work.
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
                                    text-xs font-bold
                                    text-blue-700
                                    shadow-lg
                                    transition
                                    hover:-translate-y-0.5
                                "
                            >
                                View public site
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "profile",
                                    )
                                }
                                className="
                                    rounded-xl
                                    border border-white/30
                                    bg-white/5
                                    px-5 py-3
                                    text-xs font-bold
                                    text-white
                                    hover:bg-white/10
                                "
                            >
                                Edit profile
                            </button>
                        </div>
                    </div>

                    {/* HEALTH */}
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-100">
                                Portfolio health
                            </span>

                            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        </div>

                        <p className="mt-4 text-4xl font-bold">
                            92%
                        </p>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                            <div className="h-full w-[92%] rounded-full bg-white" />
                        </div>

                        <p className="mt-3 text-[11px] text-blue-100">
                            Excellent. Add
                            experience to reach
                            100%.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <section className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">

                {/* QUICK ACTIONS */}
                <div
                    className={`rounded-3xl border p-5 ${panel}`}
                >
                    <div className="mb-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                            Shortcuts
                        </p>

                        <h2 className="mt-2 text-lg font-bold">
                            Quick actions
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Common portfolio tasks.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <QuickAction
                            dark={dark}
                            icon={UserRound}
                            title="Edit profile"
                            text="Personal information"
                            onClick={() =>
                                navigate(
                                    "profile",
                                )
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={Code2}
                            title="Manage skills"
                            text="Technologies & expertise"
                            onClick={() =>
                                navigate(
                                    "skills",
                                )
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={
                                BriefcaseBusiness
                            }
                            title="Manage projects"
                            text="Portfolio work"
                            onClick={() =>
                                navigate(
                                    "projects",
                                )
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={Users}
                            title="Manage experience"
                            text="Career history"
                            onClick={() =>
                                navigate(
                                    "experience",
                                )
                            }
                        />

                        <QuickAction
                            dark={dark}
                            icon={Bot}
                            title="AI assistant"
                            text="Chatbot knowledge"
                            onClick={() =>
                                navigate(
                                    "assistant",
                                )
                            }
                        />
                    </div>
                </div>

                {/* PROJECTS */}
                <div
                    className={`overflow-hidden rounded-3xl border ${panel}`}
                >
                    <div
                        className={`
                            flex flex-col gap-4
                            border-b p-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            ${
                                dark
                                    ? "border-slate-800"
                                    : "border-slate-100"
                            }
                        `}
                    >
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                Portfolio
                            </p>

                            <h2 className="mt-2 text-lg font-bold">
                                Recent projects
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Latest work in your
                                portfolio.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowAllProjects(
                                    !showAllProjects,
                                )
                            }
                            className="
                                inline-flex
                                items-center gap-2
                                self-start
                                rounded-xl
                                border
                                border-slate-200
                                px-3.5 py-2
                                text-[11px]
                                font-semibold
                                text-blue-600
                                hover:bg-blue-50
                            "
                        >
                            {showAllProjects
                                ? "Show less"
                                : "View all"}

                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    {recentProjects.length === 0 ? (
                        <EmptyState
                            dark={dark}
                            icon={
                                BriefcaseBusiness
                            }
                            title="No projects yet"
                            description="Add your first project to start building your portfolio."
                            actionLabel="Add project"
                            onAction={() =>
                                navigate(
                                    "projects",
                                )
                            }
                        />
                    ) : (
                        <div>
                            {recentProjects.map(
                                (project) => (
                                    <ProjectRow
                                        key={
                                            project.id
                                        }
                                        dark={dark}
                                        project={
                                            project
                                        }
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* PORTFOLIO OVERVIEW */}
            <section
                className={`
                    mt-6 rounded-3xl border p-6
                    ${panel}
                `}
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                            Overview
                        </p>

                        <h2 className="mt-2 text-lg font-bold">
                            Portfolio summary
                        </h2>
                    </div>

                    <span
                        className="
                            rounded-full
                            bg-emerald-50
                            px-3 py-1.5
                            text-[10px]
                            font-semibold
                            text-emerald-600
                        "
                    >
                        Healthy
                    </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <OverviewItem
                        dark={dark}
                        label="Featured projects"
                        value={featuredProjects}
                        icon={Sparkles}
                    />

                    <OverviewItem
                        dark={dark}
                        label="Skills"
                        value={skills.length}
                        icon={Code2}
                    />

                    <OverviewItem
                        dark={dark}
                        label="Experience entries"
                        value={experiences.length}
                        icon={Users}
                    />
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
    color:
        | "blue"
        | "indigo"
        | "purple"
        | "emerald";
}) {
    const iconClass = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        purple: "bg-purple-50 text-purple-600",
        emerald:
            "bg-emerald-50 text-emerald-600",
    }[color];

    return (
        <div
            className={`
                rounded-2xl border p-5
                transition
                hover:-translate-y-0.5
                hover:shadow-lg
                ${
                    dark
                        ? "border-slate-800 bg-[#0c1524] hover:shadow-black/20"
                        : "border-slate-200 bg-white hover:shadow-slate-200/70"
                }
            `}
        >
            <div className="flex items-start justify-between">
                <div
                    className={`
                        flex h-10 w-10
                        items-center justify-center
                        rounded-xl ${iconClass}
                    `}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <span className="text-[9px] font-bold tracking-[0.14em] text-slate-400">
                    {label}
                </span>
            </div>

            <p className="mt-5 text-3xl font-bold tracking-tight">
                {value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
                {description}
            </p>

            <div className="mt-4 flex items-center gap-2">
                {change.includes("+") ? (
                    <>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                            <ArrowUpRight className="h-3 w-3" />
                            {change}
                        </span>

                        <span className="text-[10px] text-slate-400">
                            this month
                        </span>
                    </>
                ) : (
                    <span className="text-[10px] text-slate-400">
                        — {change}
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
                rounded-xl border p-3
                text-left
                transition
                ${
                    dark
                        ? "border-slate-800 hover:border-blue-500/30 hover:bg-slate-900"
                        : "border-slate-100 hover:border-blue-100 hover:bg-blue-50/40"
                }
            `}
        >
            <div
                className="
                    flex h-9 w-9
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                "
            >
                <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">
                    {title}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-slate-500">
                    {text}
                </p>
            </div>

            <ChevronRight
                className="
                    h-4 w-4
                    text-slate-400
                    transition
                    group-hover:translate-x-1
                    group-hover:text-blue-500
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
                group flex gap-4
                border-b p-4
                transition
                last:border-b-0
                ${
                    dark
                        ? "border-slate-800 hover:bg-slate-900/50"
                        : "border-slate-100 hover:bg-slate-50/70"
                }
            `}
        >
            <div
                className="
                    relative h-[68px]
                    w-[78px]
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
                        className="
                            h-full w-full
                            object-cover
                            transition duration-500
                            group-hover:scale-105
                        "
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-400">
                        <Code2 className="h-6 w-6" />
                    </div>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold">
                                {project.title}
                            </h3>

                            {project.featured && (
                                <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                            )}
                        </div>

                        <p className="mt-1 truncate text-[11px] text-slate-500">
                            {project.summary}
                        </p>
                    </div>

                    <span className="hidden shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold capitalize text-emerald-600 sm:block">
                        {project.status}
                    </span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={`
                                rounded-md
                                border px-1.5 py-0.5
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-wide
                                ${
                                    dark
                                        ? "border-slate-700 text-slate-500"
                                        : "border-slate-200 text-slate-500"
                                }
                            `}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="button"
                className="
                    hidden h-8 w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-700
                    md:flex
                "
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>
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
        action:
            | ((formData: FormData) => Promise<unknown>)
            | undefined,
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
                eyebrow="Content"
                title="Skills"
                description="Manage the technologies and capabilities displayed on your portfolio."
                count={`${skills.length} skills`}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Search skills..."
                        className={`
                            admin-input w-full
                            pl-11
                            ${
                                dark
                                    ? "border-slate-800 bg-[#0c1524]"
                                    : "border-slate-200 bg-white"
                            }
                        `}
                    />
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowCreate(
                            !showCreate,
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-xs font-bold
                        text-white
                        shadow-lg
                        shadow-blue-600/15
                        transition
                        hover:bg-blue-700
                    "
                >
                    <Plus className="h-4 w-4" />
                    Add skill
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
                        mb-5 rounded-2xl border p-5
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c1524]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <div className="mb-4">
                        <h2 className="text-sm font-bold">
                            Add new skill
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Add a technology or
                            professional capability.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_100px_auto]">
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
                                text-xs
                                font-bold
                                text-white
                            "
                        >
                            Add skill
                        </button>
                    </div>
                </form>
            )}

            <div
                className={`
                    overflow-hidden
                    rounded-2xl border
                    ${
                        dark
                            ? "border-slate-800 bg-[#0c1524]"
                            : "border-slate-200 bg-white"
                    }
                `}
            >
                <div
                    className={`
                        hidden grid-cols-[1.5fr_1fr_90px_100px]
                        gap-3 border-b px-5 py-3
                        text-[9px]
                        font-bold uppercase
                        tracking-[0.16em]
                        text-slate-400
                        sm:grid
                        ${
                            dark
                                ? "border-slate-800"
                                : "border-slate-100"
                        }
                    `}
                >
                    <span>Skill</span>
                    <span>Category</span>
                    <span>Order</span>
                    <span>Actions</span>
                </div>

                {skills.length === 0 ? (
                    <EmptyState
                        dark={dark}
                        icon={Code2}
                        title="No skills found"
                        description="Try another search or add your first skill."
                    />
                ) : (
                    skills.map((skill) => (
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
                            className={`
                                grid gap-3
                                border-b p-4
                                last:border-0
                                sm:grid-cols-[1.5fr_1fr_90px_100px]
                                ${
                                    dark
                                        ? "border-slate-800"
                                        : "border-slate-100"
                                }
                            `}
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
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        hover:bg-blue-100
                                    "
                                    aria-label="Save skill"
                                >
                                    <Check className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={(
                                        event,
                                    ) => {
                                        const form =
                                            event
                                                .currentTarget
                                                .form;

                                        if (!form)
                                            return;

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
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-slate-900
                                        text-white
                                        hover:bg-red-600
                                    "
                                    aria-label="Delete skill"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    ))
                )}
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
        action:
            | ((formData: FormData) => Promise<unknown>)
            | undefined,
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
                eyebrow="Portfolio"
                title="Projects"
                description="Create and manage the projects displayed on your portfolio."
                count={`${projects.length} projects`}
            />

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value,
                            )
                        }
                        placeholder="Search projects..."
                        className="admin-input w-full pl-11"
                    />
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowCreate(
                            !showCreate,
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-xs font-bold
                        text-white
                        shadow-lg
                        shadow-blue-600/15
                        hover:bg-blue-700
                    "
                >
                    <Plus className="h-4 w-4" />
                    Add project
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
                {projects.length === 0 ? (
                    <div
                        className={`
                            rounded-2xl border
                            ${
                                dark
                                    ? "border-slate-800 bg-[#0c1524]"
                                    : "border-slate-200 bg-white"
                            }
                        `}
                    >
                        <EmptyState
                            dark={dark}
                            icon={
                                BriefcaseBusiness
                            }
                            title="No projects found"
                            description="Add a project to showcase your work."
                        />
                    </div>
                ) : (
                    projects.map((project) => (
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
                            onSubmit={(
                                formData,
                            ) => {
                                void runAction(
                                    updateProjectAction,
                                    formData,
                                    `${project.title} updated.`,
                                );
                            }}
                            onDelete={(
                                formData,
                            ) => {
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
                    ))
                )}
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
                        ? "border-slate-800 bg-[#0c1524]"
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

            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            {create ? (
                                <Plus className="h-4 w-4" />
                            ) : (
                                <BriefcaseBusiness className="h-4 w-4" />
                            )}
                        </div>

                        <div>
                            <h2 className="text-sm font-bold">
                                {create
                                    ? "Create project"
                                    : project?.title}
                            </h2>

                            <p className="text-[10px] text-slate-500">
                                {create
                                    ? "Add a new portfolio project."
                                    : "Edit project information."}
                            </p>
                        </div>
                    </div>
                </div>

                {project?.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-semibold text-amber-600">
                        <Sparkles className="h-3 w-3" />
                        Featured
                    </span>
                )}
            </div>

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
                    placeholder="project-slug"
                    required
                    className="admin-input"
                />

                <input
                    name="url"
                    defaultValue={
                        project?.url ?? ""
                    }
                    placeholder="Live project URL"
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
                    placeholder="Project image URL"
                    className="admin-input md:col-span-2"
                />

                <input
                    name="tags"
                    defaultValue={
                        project?.tags ?? ""
                    }
                    placeholder="NEXT.JS, REACT, TYPESCRIPT"
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
                    className={`
                        flex items-center
                        gap-3 rounded-xl
                        border px-4 py-3
                        text-xs font-medium
                        ${
                            dark
                                ? "border-slate-700"
                                : "border-slate-200"
                        }
                    `}
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
                    placeholder="Short project summary"
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
                    rows={6}
                    className="admin-input resize-none md:col-span-2"
                />
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {project &&
                    deleteAction &&
                    onDelete && (
                        <button
                            type="button"
                            onClick={(event) => {
                                const form =
                                    event
                                        .currentTarget
                                        .form;

                                if (!form)
                                    return;

                                onDelete(
                                    new FormData(
                                        form,
                                    ),
                                );
                            }}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-slate-900
                                px-4 py-2.5
                                text-xs
                                font-semibold
                                text-white
                                hover:bg-red-600
                            "
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </button>
                    )}

                <button
                    type="submit"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-2.5
                        text-xs font-bold
                        text-white
                        shadow-lg
                        shadow-blue-600/15
                        hover:bg-blue-700
                    "
                >
                    {create ? (
                        <>
                            <Plus className="h-3.5 w-3.5" />
                            Create project
                        </>
                    ) : (
                        <>
                            <Check className="h-3.5 w-3.5" />
                            Save changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

/* =========================================================
   PROFILE VIEW
========================================================= */

function ProfileView({
    dark,
    profile,
    action,
    runAction,
}: {
    dark: boolean;
    profile?: Profile | null;
    action?: (
        formData: FormData,
    ) => Promise<unknown>;
    runAction: (
        action:
            | ((formData: FormData) => Promise<unknown>)
            | undefined,
        formData: FormData,
        successText: string,
    ) => Promise<void>;
}) {
    return (
        <section>
            <PageHeader
                dark={dark}
                eyebrow="Content"
                title="Profile"
                description="Manage the information visitors see on your portfolio."
                count="Public profile"
            />

            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    void runAction(
                        action,
                        new FormData(
                            event.currentTarget,
                        ),
                        "Profile updated successfully.",
                    );
                }}
                className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]"
            >
                {/* PROFILE PREVIEW */}
                <div
                    className={`
                        rounded-3xl border p-6
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c1524]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-xl shadow-blue-600/20">
                                {profile?.avatarUrl ? (
                                    <img
                                        src={
                                            profile.avatarUrl
                                        }
                                        alt={
                                            profile.name ??
                                            "Profile"
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    (
                                        profile?.name ??
                                        "F"
                                    )
                                        .charAt(0)
                                        .toUpperCase()
                                )}
                            </div>

                            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                                <Check className="h-3 w-3" />
                            </span>
                        </div>

                        <h2 className="mt-5 text-lg font-bold">
                            {profile?.name ??
                                "Your Name"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {profile?.headline ??
                                "Full-stack developer"}
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-semibold text-blue-600">
                                Available
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-semibold text-slate-500">
                                Developer
                            </span>
                        </div>
                    </div>
                </div>

                {/* PROFILE FORM */}
                <div
                    className={`
                        rounded-3xl border p-6
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c1524]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <div className="mb-6">
                        <h2 className="text-base font-bold">
                            Personal information
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Keep your public identity
                            up to date.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            label="Full name"
                            name="name"
                            defaultValue={
                                profile?.name ??
                                ""
                            }
                            placeholder="Your name"
                            dark={dark}
                        />

                        <FormField
                            label="Headline"
                            name="headline"
                            defaultValue={
                                profile?.headline ??
                                ""
                            }
                            placeholder="Full-stack developer"
                            dark={dark}
                        />

                        <FormField
                            label="Location"
                            name="location"
                            defaultValue={
                                profile?.location ??
                                ""
                            }
                            placeholder="San Francisco, CA"
                            dark={dark}
                        />

                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            defaultValue={
                                profile?.email ??
                                ""
                            }
                            placeholder="hello@example.com"
                            dark={dark}
                        />

                        <FormField
                            label="Website"
                            name="website"
                            defaultValue={
                                profile?.website ??
                                ""
                            }
                            placeholder="https://..."
                            dark={dark}
                        />

                        <FormField
                            label="GitHub"
                            name="github"
                            defaultValue={
                                profile?.github ??
                                ""
                            }
                            placeholder="https://github.com/..."
                            dark={dark}
                        />

                        <FormField
                            label="LinkedIn"
                            name="linkedin"
                            defaultValue={
                                profile?.linkedin ??
                                ""
                            }
                            placeholder="https://linkedin.com/in/..."
                            dark={dark}
                        />

                        <FormField
                            label="Avatar URL"
                            name="avatarUrl"
                            defaultValue={
                                profile?.avatarUrl ??
                                ""
                            }
                            placeholder="https://..."
                            dark={dark}
                        />

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Bio
                            </label>

                            <textarea
                                name="bio"
                                defaultValue={
                                    profile?.bio ??
                                    ""
                                }
                                rows={7}
                                placeholder="Tell visitors about yourself..."
                                className="admin-input w-full resize-none"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-blue-600
                                px-5 py-3
                                text-xs font-bold
                                text-white
                                shadow-lg
                                shadow-blue-600/15
                                hover:bg-blue-700
                            "
                        >
                            <Check className="h-4 w-4" />
                            Save profile
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}

/* =========================================================
   EXPERIENCE VIEW
========================================================= */

function ExperienceView({
    dark,
    experiences,
    createAction,
    updateAction,
    deleteAction,
    runAction,
}: {
    dark: boolean;
    experiences: Experience[];
    createAction?: (
        formData: FormData,
    ) => Promise<unknown>;
    updateAction?: (
        formData: FormData,
    ) => Promise<unknown>;
    deleteAction?: (
        formData: FormData,
    ) => Promise<unknown>;
    runAction: (
        action:
            | ((formData: FormData) => Promise<unknown>)
            | undefined,
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
                eyebrow="Career"
                title="Experience"
                description="Manage your professional history and career timeline."
                count={`${experiences.length} entries`}
            />

            <div className="mb-6 flex justify-end">
                <button
                    type="button"
                    onClick={() =>
                        setShowCreate(
                            !showCreate,
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-xs font-bold
                        text-white
                        shadow-lg
                        shadow-blue-600/15
                    "
                >
                    <Plus className="h-4 w-4" />
                    Add experience
                </button>
            </div>

            {showCreate && (
                <ExperienceForm
                    dark={dark}
                    create
                    action={createAction}
                    onSubmit={(formData) => {
                        void runAction(
                            createAction,
                            formData,
                            "Experience created successfully.",
                        );

                        setShowCreate(false);
                    }}
                />
            )}

            {experiences.length === 0 ? (
                <div
                    className={`
                        rounded-3xl border
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c1524]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <EmptyState
                        dark={dark}
                        icon={BriefcaseBusiness}
                        title="No experience yet"
                        description="Add your professional history to make your portfolio more complete."
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map(
                        (experience) => (
                            <ExperienceForm
                                key={
                                    experience.id
                                }
                                dark={dark}
                                experience={
                                    experience
                                }
                                action={
                                    updateAction
                                }
                                deleteAction={
                                    deleteAction
                                }
                                onSubmit={(
                                    formData,
                                ) => {
                                    void runAction(
                                        updateAction,
                                        formData,
                                        "Experience updated successfully.",
                                    );
                                }}
                                onDelete={(
                                    formData,
                                ) => {
                                    if (
                                        window.confirm(
                                            `Delete ${experience.position} at ${experience.company}?`,
                                        )
                                    ) {
                                        void runAction(
                                            deleteAction,
                                            formData,
                                            "Experience deleted successfully.",
                                        );
                                    }
                                }}
                            />
                        ),
                    )}
                </div>
            )}
        </section>
    );
}

/* =========================================================
   EXPERIENCE FORM
========================================================= */

function ExperienceForm({
    dark,
    experience,
    create,
    action,
    deleteAction,
    onSubmit,
    onDelete,
}: {
    dark: boolean;
    experience?: Experience;
    create?: boolean;
    action?: (
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
                rounded-3xl border p-6
                ${
                    dark
                        ? "border-slate-800 bg-[#0c1524]"
                        : "border-slate-200 bg-white"
                }
            `}
        >
            {experience && (
                <input
                    type="hidden"
                    name="id"
                    value={experience.id}
                />
            )}

            <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div className="flex-1">
                    <h2 className="text-sm font-bold">
                        {create
                            ? "New experience"
                            : experience?.position}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        {create
                            ? "Add a role to your career history."
                            : experience?.company}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField
                    label="Company"
                    name="company"
                    defaultValue={
                        experience?.company ??
                        ""
                    }
                    placeholder="Company name"
                    dark={dark}
                />

                <FormField
                    label="Position"
                    name="position"
                    defaultValue={
                        experience?.position ??
                        ""
                    }
                    placeholder="Senior Developer"
                    dark={dark}
                />

                <FormField
                    label="Location"
                    name="location"
                    defaultValue={
                        experience?.location ??
                        ""
                    }
                    placeholder="Remote"
                    dark={dark}
                />

                <FormField
                    label="Start date"
                    name="startDate"
                    defaultValue={
                        experience?.startDate ??
                        ""
                    }
                    placeholder="Jan 2024"
                    dark={dark}
                />

                <FormField
                    label="End date"
                    name="endDate"
                    defaultValue={
                        experience?.endDate ??
                        ""
                    }
                    placeholder="Present"
                    dark={dark}
                />

                <div className="md:col-span-2">
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Description
                    </label>

                    <textarea
                        name="description"
                        defaultValue={
                            experience?.description ??
                            ""
                        }
                        rows={6}
                        placeholder="Describe your responsibilities and achievements..."
                        className="admin-input w-full resize-none"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {experience &&
                    deleteAction &&
                    onDelete && (
                        <button
                            type="button"
                            onClick={(event) => {
                                const form =
                                    event
                                        .currentTarget
                                        .form;

                                if (!form)
                                    return;

                                onDelete(
                                    new FormData(
                                        form,
                                    ),
                                );
                            }}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-slate-900
                                px-4 py-2.5
                                text-xs font-semibold
                                text-white
                                hover:bg-red-600
                            "
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                        </button>
                    )}

                <button
                    type="submit"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-2.5
                        text-xs font-bold
                        text-white
                    "
                >
                    <Check className="h-3.5 w-3.5" />
                    {create
                        ? "Create experience"
                        : "Save changes"}
                </button>
            </div>
        </form>
    );
}

/* =========================================================
   AI ASSISTANT
========================================================= */

function AssistantView({
    dark,
}: {
    dark: boolean;
}) {
    return (
        <section>
            <PageHeader
                dark={dark}
                eyebrow="AI"
                title="AI Assistant"
                description="Control the information your portfolio chatbot uses when speaking with potential clients."
                count="AI knowledge"
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <div
                    className={`
                        rounded-3xl border p-6
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c1524]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <div
                            className="
                                flex h-12 w-12
                                items-center justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-blue-600
                                to-indigo-600
                                text-white
                                shadow-lg
                                shadow-blue-600/20
                            "
                        >
                            <Bot className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="text-base font-bold">
                                Portfolio AI
                                Assistant
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Your AI-powered portfolio
                                representative.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <AssistantCard
                            icon={UserRound}
                            title="Profile context"
                            text="Personal information"
                        />

                        <AssistantCard
                            icon={Code2}
                            title="Skills context"
                            text="Technical expertise"
                        />

                        <AssistantCard
                            icon={BriefcaseBusiness}
                            title="Projects context"
                            text="Portfolio work"
                        />

                        <AssistantCard
                            icon={FileText}
                            title="Experience context"
                            text="Professional history"
                        />
                    </div>

                    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                        <div className="flex gap-3">
                            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                            <div>
                                <h3 className="text-xs font-bold text-blue-900">
                                    Keep your data
                                    accurate
                                </h3>

                                <p className="mt-1 text-[11px] leading-5 text-blue-700">
                                    The assistant
                                    performs best when
                                    your profile,
                                    projects, skills and
                                    experience are
                                    complete and
                                    up-to-date.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`
                        rounded-3xl border p-6
                        ${
                            dark
                                ? "border-slate-800 bg-[#0c1524]"
                                : "border-slate-200 bg-white"
                        }
                    `}
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                        Status
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </span>

                        <div>
                            <p className="text-sm font-bold">
                                Assistant ready
                            </p>

                            <p className="text-[10px] text-slate-500">
                                Knowledge base connected
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <StatusRow
                            label="Profile"
                            value="Connected"
                        />

                        <StatusRow
                            label="Skills"
                            value="Connected"
                        />

                        <StatusRow
                            label="Projects"
                            value="Connected"
                        />

                        <StatusRow
                            label="Experience"
                            value="Connected"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsView({
    dark,
}: {
    dark: boolean;
}) {
    return (
        <section>
            <PageHeader
                dark={dark}
                eyebrow="System"
                title="Settings"
                description="Configure your portfolio administration experience."
                count="Configuration"
            />

            <div className="grid gap-6 lg:grid-cols-2">
                <SettingsCard
                    dark={dark}
                    icon={ShieldCheck}
                    title="Security"
                    description="Manage administrative security preferences."
                >
                    <SettingToggle
                        title="Admin authentication"
                        description="Require authentication for the dashboard."
                        enabled
                    />

                    <SettingToggle
                        title="Secure session"
                        description="Keep administrative sessions protected."
                        enabled
                    />
                </SettingsCard>

                <SettingsCard
                    dark={dark}
                    icon={Bot}
                    title="AI Assistant"
                    description="Configure chatbot behavior."
                >
                    <SettingToggle
                        title="AI assistant enabled"
                        description="Allow visitors to interact with the assistant."
                        enabled
                    />

                    <SettingToggle
                        title="Use portfolio data"
                        description="Use profile and project information as context."
                        enabled
                    />
                </SettingsCard>

                <SettingsCard
                    dark={dark}
                    icon={Globe2}
                    title="Public portfolio"
                    description="Manage public-facing behavior."
                >
                    <SettingToggle
                        title="Portfolio published"
                        description="Make your portfolio visible to visitors."
                        enabled
                    />

                    <SettingToggle
                        title="Show projects"
                        description="Display your projects publicly."
                        enabled
                    />
                </SettingsCard>

                <SettingsCard
                    dark={dark}
                    icon={Settings}
                    title="Preferences"
                    description="General administration preferences."
                >
                    <SettingToggle
                        title="Email notifications"
                        description="Receive important portfolio notifications."
                    />

                    <SettingToggle
                        title="Analytics"
                        description="Track portfolio visitor activity."
                        enabled
                    />
                </SettingsCard>
            </div>
        </section>
    );
}

/* =========================================================
   SETTINGS CARD
========================================================= */

function SettingsCard({
    dark,
    icon: Icon,
    title,
    description,
    children,
}: {
    dark: boolean;
    icon: typeof Settings;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`
                rounded-3xl border p-6
                ${
                    dark
                        ? "border-slate-800 bg-[#0c1524]"
                        : "border-slate-200 bg-white"
                }
            `}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-sm font-bold">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                {children}
            </div>
        </div>
    );
}

/* =========================================================
   SETTING TOGGLE
========================================================= */

function SettingToggle({
    title,
    description,
    enabled = false,
}: {
    title: string;
    description: string;
    enabled?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div>
                <p className="text-xs font-semibold">
                    {title}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                    {description}
                </p>
            </div>

            <div
                className={`
                    relative h-5 w-9
                    rounded-full
                    ${
                        enabled
                            ? "bg-blue-600"
                            : "bg-slate-200"
                    }
                `}
            >
                <span
                    className={`
                        absolute top-0.5
                        h-4 w-4 rounded-full
                        bg-white shadow-sm
                        transition
                        ${
                            enabled
                                ? "left-[18px]"
                                : "left-0.5"
                        }
                    `}
                />
            </div>
        </div>
    );
}

/* =========================================================
   ASSISTANT CARD
========================================================= */

function AssistantCard({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof Code2;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-100 p-4">
            <Icon className="h-4 w-4 text-blue-600" />

            <p className="mt-4 text-xs font-bold">
                {title}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
                {text}
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Connected
            </div>
        </div>
    );
}

/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
            <span className="text-xs text-slate-500">
                {label}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {value}
            </span>
        </div>
    );
}

/* =========================================================
   OVERVIEW ITEM
========================================================= */

function OverviewItem({
    dark,
    label,
    value,
    icon: Icon,
}: {
    dark: boolean;
    label: string;
    value: number;
    icon: typeof Code2;
}) {
    return (
        <div
            className={`
                flex items-center
                gap-4 rounded-2xl
                border p-4
                ${
                    dark
                        ? "border-slate-800 bg-slate-900/40"
                        : "border-slate-100 bg-slate-50/60"
                }
            `}
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-4 w-4" />
            </div>

            <div>
                <p className="text-2xl font-bold">
                    {value}
                </p>

                <p className="text-[10px] text-slate-500">
                    {label}
                </p>
            </div>
        </div>
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
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                    {eyebrow}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>

            <span
                className={`
                    w-fit rounded-full
                    px-3 py-1.5
                    text-[10px]
                    font-semibold
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
   FORM FIELD
========================================================= */

function FormField({
    label,
    name,
    defaultValue,
    placeholder,
    type = "text",
    dark,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    type?: string;
    dark: boolean;
}) {
    return (
        <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </label>

            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={`
                    admin-input w-full
                    ${
                        dark
                            ? "border-slate-700 bg-slate-900"
                            : ""
                    }
                `}
            />
        </div>
    );
}

/* =========================================================
   NOTICE
========================================================= */

function Notice({
    notice,
    onClose,
    dark,
}: {
    notice: {
        type: "success" | "error";
        text: string;
    };
    onClose: () => void;
    dark: boolean;
}) {
    return (
        <div
            className={`
                mb-6 flex items-center
                justify-between gap-4
                rounded-2xl border px-4 py-3
                ${
                    notice.type === "success"
                        ? dark
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : dark
                            ? "border-red-500/20 bg-red-500/5 text-red-400"
                            : "border-red-200 bg-red-50 text-red-700"
                }
            `}
        >
            <div className="flex items-center gap-2">
                {notice.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                ) : (
                    <Activity className="h-4 w-4" />
                )}

                <span className="text-xs font-medium">
                    {notice.text}
                </span>
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-black/5"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
    dark,
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: {
    dark: boolean;
    icon: typeof Code2;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Icon className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-sm font-bold">
                {title}
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4 py-2.5
                        text-xs font-bold
                        text-white
                    "
                >
                    <Plus className="h-3.5 w-3.5" />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

/* =========================================================
   COMMAND MODAL
========================================================= */

function CommandModal({
    dark,
    navigate,
    onClose,
}: {
    dark: boolean;
    navigate: (tab: Tab) => void;
    onClose: () => void;
}) {
    const commands: {
        label: string;
        tab: Tab;
        icon: typeof Code2;
    }[] = [
        {
            label: "Dashboard",
            tab: "dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Profile",
            tab: "profile",
            icon: UserRound,
        },
        {
            label: "Skills",
            tab: "skills",
            icon: Code2,
        },
        {
            label: "Projects",
            tab: "projects",
            icon: BriefcaseBusiness,
        },
        {
            label: "Experience",
            tab: "experience",
            icon: Users,
        },
        {
            label: "AI Assistant",
            tab: "assistant",
            icon: Bot,
        },
        {
            label: "Settings",
            tab: "settings",
            icon: Settings,
        },
    ];

    return (
        <div
            className="
                fixed inset-0 z-[100]
                flex items-start
                justify-center
                bg-slate-950/50
                px-4 pt-[15vh]
                backdrop-blur-sm
            "
            onMouseDown={onClose}
        >
            <div
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className={`
                    w-full max-w-lg
                    overflow-hidden
                    rounded-2xl
                    border
                    shadow-2xl
                    ${
                        dark
                            ? "border-slate-700 bg-[#0c1524]"
                            : "border-slate-200 bg-white"
                    }
                `}
            >
                <div
                    className={`
                        flex items-center gap-3
                        border-b px-4 py-4
                        ${
                            dark
                                ? "border-slate-800"
                                : "border-slate-100"
                        }
                    `}
                >
                    <Command className="h-4 w-4 text-blue-600" />

                    <span className="flex-1 text-sm font-medium">
                        Quick navigation
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-2">
                    {commands.map(
                        ({
                            label,
                            tab,
                            icon: Icon,
                        }) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => {
                                    navigate(tab);
                                    onClose();
                                }}
                                className={`
                                    flex w-full
                                    items-center gap-3
                                    rounded-xl
                                    px-3 py-3
                                    text-left text-xs
                                    font-medium
                                    ${
                                        dark
                                            ? "hover:bg-slate-900"
                                            : "hover:bg-slate-50"
                                    }
                                `}
                            >
                                <Icon className="h-4 w-4 text-slate-400" />

                                {label}

                                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-300" />
                            </button>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   HELPERS
========================================================= */

function tabTitle(tab: Tab) {
    switch (tab) {
        case "dashboard":
            return "Dashboard";
        case "profile":
            return "Profile";
        case "skills":
            return "Skills";
        case "projects":
            return "Projects";
        case "experience":
            return "Experience";
        case "assistant":
            return "AI Assistant";
        case "settings":
            return "Settings";
        default:
            return "Dashboard";
    }
}