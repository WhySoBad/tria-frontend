import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";
import React, { useEffect } from "react";
import { AuthProvider } from "../hooks/AuthContext";
import { ChatProvider } from "../hooks/ChatContext";
import { ClientProvider } from "../hooks/ClientContext";
import { ModalProvider } from "../hooks/ModalContext";
import "../styles/main.scss";

const WrapPage: NextPage<AppProps> = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  return (
    <AuthProvider>
      <ClientProvider>
        <ModalProvider>
          <ChatProvider>
            <Component {...pageProps} />
          </ChatProvider>
        </ModalProvider>
      </ClientProvider>
    </AuthProvider>
  );
};

export default WrapPage;
