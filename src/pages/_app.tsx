import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import React, { useEffect } from "react";
import { AuthProvider } from "../hooks/AuthContext";
import { BurgerProvider } from "../hooks/BurgerContext";
import { ChatProvider } from "../hooks/ChatContext";
import { ClientProvider } from "../hooks/ClientContext";
import { LanguageProvider } from "../hooks/LanguageContext";
import { ModalProvider } from "../hooks/ModalContext";
import "../styles/main.scss";

const WrapPage: NextPage<AppProps> = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="utf-8" />
      </Head>
      <AuthProvider>
        <ClientProvider>
          <LanguageProvider>
            <ModalProvider>
              <BurgerProvider>
                <ChatProvider>
                  <Component {...pageProps} />
                </ChatProvider>
              </BurgerProvider>
            </ModalProvider>
          </LanguageProvider>
        </ClientProvider>
      </AuthProvider>
    </>
  );
};

export default WrapPage;
