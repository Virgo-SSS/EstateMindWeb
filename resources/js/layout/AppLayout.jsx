import {
    SidebarProvider,
    useSidebar
} from "../context/SidebarContext"
import AppHeader from "./AppHeader"
import Backdrop from "./Backdrop"
import AppSidebar from "./AppSidebar"
import { ThemeProvider } from "../context/ThemeContext"

const LayoutContent = ({ children }) => {
    const {
        isExpanded,
        isHovered,
        isMobileOpen
    } = useSidebar()

    return ( 
        <div className="min-h-screen xl:flex bg-[#f7f7f7] dark:bg-gray-900">
            <div>
                <AppSidebar />
                <Backdrop />
            </div>
            <div
                className={
                    `flex-1 transition-all duration-300 ease-in-out 
                    ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"} 
                    ${isMobileOpen ? "ml-0" : ""}`
                }
            >
                <AppHeader />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

const AppLayout = ({ children, ...props }) => {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <LayoutContent {...props}>
                    {children}
                </LayoutContent>
            </SidebarProvider>
        </ThemeProvider>
    )
}

export default AppLayout
