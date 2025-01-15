"use client";

import Header from "@/components/custom/Header";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/userDetailContext";
import { api } from "@/convex/_generated/api";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

function Provider({ children }) {
  const [messages, setMessages] = useState();
  const [userDetail, setUserDetail] = useState();
  const convex = useConvex();

  useEffect(() => {
    isAuthenticated();
  }, []);
  const isAuthenticated = async () => {
    if (typeof window !== undefined) {
      const user = JSON.parse(localStorage.getItem("user"));
      //Fetch the database
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });
      setUserDetail(result)
      console.log(result);
      
    }
  };
  return (
    <div>
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
              <Header />
              {children}
            </NextThemesProvider>
          </MessageContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Provider;
