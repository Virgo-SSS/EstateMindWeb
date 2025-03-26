import { useCallback, useEffect, useRef, useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import { useSidebar } from "../context/SidebarContext"
import SidebarWidget from "./SidebarWidget"
import { ChevronDown, Coins, FolderKanban, LayoutGrid, UserCog } from "lucide-react"

const navItems = [
    {
        icon: <LayoutGrid />,
        name: "Dashboard",
        path: route("dashboard"),
    },
    {
        icon: <UserCog />,
        name: "Users",
        path: route("users.index"),
    },
    {
        icon: <Coins />,
        name: "Sales",
        path: route("sales.index"),
    },
    {
        icon: <FolderKanban />,
        name: "Projects",
        path: route("project.index"),
    }
]

const AppSidebar = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
    const { url } = usePage()
    const fullUrl = route(route().current())

    const [openSubmenu, setOpenSubmenu] = useState(null)
    const [subMenuHeight, setSubMenuHeight] = useState({})
    const subMenuRefs = useRef({})

    const isActive = useCallback((path) => {
        return fullUrl === path
    }, [fullUrl])

    useEffect(() => {
        let submenuMatched = false;
        
        navItems.forEach((nav, index) => {
            if (nav.subItems) {
                nav.subItems.forEach(subItem => {
                    if (isActive(subItem.path)) {
                        setOpenSubmenu({
                            index
                        })

                        submenuMatched = true
                    }
                })
            }
        })

        if (!submenuMatched) {
            setOpenSubmenu(null)
        }
    }, [url, isActive])

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.index}`
            if (subMenuRefs.current[key]) {
                setSubMenuHeight(prevHeights => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0
                }))
            }
        }
    }, [openSubmenu])

    const handleSubmenuToggle = (index) => {
        setOpenSubmenu(prevOpenSubmenu => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.index === index
            ) {
                return null
            }
            return { index }
        })
    }

    const renderMenuItems = (items) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>

                    {/* Parent Menu */}
                    {nav.subItems ? (
                        // Parent menu that has sub menu
                        <button
                            onClick={() => handleSubmenuToggle(index)}
                            className={`menu-item group ${
                                openSubmenu?.index === index
                                ? "menu-item-active"
                                : "menu-item-inactive"
                            } cursor-pointer ${
                                !isExpanded && !isHovered
                                ? "lg:justify-center"
                                : "lg:justify-start"
                            }`}
                        >
                            <span
                                className={`menu-item-icon-size  ${
                                openSubmenu?.index === index
                                    ? "menu-item-icon-active"
                                    : "menu-item-icon-inactive"
                                }`}
                            >
                                {nav.icon}
                            </span>

                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text">{nav.name}</span>
                            )}

                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDown
                                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                        openSubmenu?.index === index
                                        ? "rotate-180 text-brand-500"
                                        : ""
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            // Parent menu that doesn't have sub menu
                            <Link
                                href={nav.path}
                                className={`menu-item group ${
                                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                                }`}
                            >
                                <span
                                    className={`menu-item-icon-size ${
                                        isActive(nav.path)
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}

                    {/* Children Menu */}
                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={el => {
                                subMenuRefs.current[`${index}`] = el
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height: openSubmenu?.index === index
                                        ? `${subMenuHeight[`${index}`]}px`
                                        : "0px"
                            }}
                        >
                            <ul className="mt-2 space-y-1 ml-9">
                                {nav.subItems.map(subItem => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item ${
                                                isActive(subItem.path)
                                                ? "menu-dropdown-item-active"
                                                : "menu-dropdown-item-inactive"
                                            }`}
                                        >
                                            {subItem.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 
                text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
                ${
                    isExpanded || isMobileOpen
                    ? "w-[290px]"
                    : isHovered
                    ? "w-[290px]"
                    : "w-[90px]"
                }
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0`
            }
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`
                    py-8 flex 
                    ${ 
                        !isExpanded && !isHovered 
                        ? "lg:justify-center" 
                        : "justify-start"
                    }`
                }
            >
                <Link href="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <img
                            src="/images/logo/abp-logo-icon.png"
                            alt="Logo"
                            width={150}
                            height={30}
                        />
                    ) : (
                        <img
                            src="/images/logo/abp-logo.png"
                            alt="Logo"
                            width={40}
                            height={40}
                        />
                    )}
                </Link>
            </div>

            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            {renderMenuItems(navItems, "main")}
                        </div>
                    </div>
                </nav>
                {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
            </div>
        </aside>
    )
}

export default AppSidebar
