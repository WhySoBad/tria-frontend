import { NextPage } from "next";
import { AppProps } from "next/dist/next-server/lib/router/router";
import React, { useEffect } from "react";
import { AuthProvider, BurgerProvider, ChatProvider, ClientProvider, LanguageProvider, ModalProvider } from "../hooks";
import "../styles/main.scss";

const WrapPage: NextPage<AppProps> = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement.removeChild(jssStyles);
  }, []);

  return (
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
  );
};

export default WrapPage;
