import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { ThemeProvider } from "../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

const LayoutContent = ({ children }) => {
  const pageProps = usePage().props;

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  useEffect(() => {
    // Show success message if available
    if (pageProps.flash.success) {
      toast.success(pageProps.flash.success, {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    }

    // Clear the flash message after showing it
    return () => {
      if (pageProps.flash.success) {
        pageProps.flash.success = null;
      }
    };
  }, [pageProps.flash.success]);

  return (
    <div className="min-h-screen xl:flex bg-[#f7f7f7] dark:bg-gray-900">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out 
                    ${
                      isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } 
                    ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

const AppLayout = ({ children, ...props }) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <LayoutContent {...props}>{children}</LayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
