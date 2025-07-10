"use client";

import AppSidebar from "@/components/custom/AppSidebar";
import Header from "@/components/custom/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

function Provider({ children }) {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState();
  const convex = useConvex();

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem("user"));
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetail(result);
    }
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <MessageContext.Provider value={{ messages, setMessages }}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen">
              <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <div className="flex-1">
                  <Header />
                  <main className="w-full">
                    {children}
                  </main>
                </div>
              </SidebarProvider>
            </div>
          </NextThemesProvider>
        </MessageContext.Provider>
      </UserDetailContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default Provider;