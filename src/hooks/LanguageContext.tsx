import { Locale } from "client";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Translation } from "../lang";
import { German } from "../lang/languages/DE";
import { English } from "../lang/languages/EN";
import { useClient } from "./ClientContext";

interface LanguageContext {
  language: Locale;
  setLanguage: (locale: Locale) => void;
  translation: Translation;
}

const defaultValue: LanguageContext = {
  language: "EN",
  setLanguage: () => {},
  translation: English,
};

export const LanguageContext = React.createContext<LanguageContext>(defaultValue);

export const LanguageProvider: NextPage = ({ children }): JSX.Element => {
  const { client } = useClient();
  const [cookies, setCookie] = useCookies();
  const [language, setLanguage] = useState<Locale>("EN");
  const translations: { [key: string]: Translation } = {
    EN: English,
    DE: German,
    FR: English,
  };

  useEffect(() => {
    const lang: string = navigator.language.length > 2 ? navigator.language.split("-")[0].toUpperCase() : navigator.language;
    if (cookies.language) setLanguage(cookies.language);
    else setLanguage(lang === "DE" ? "DE" : lang === "FR" ? "EN" : "EN");
  }, []);

  useEffect(() => {
    if (client) setLanguage(client.user.locale);
  }, [client]);

  useEffect(() => {
    setCookie("language", language, {
      expires: new Date(Date.now() + 365 * 86400000 * 10), //set cookie for 10 years
      path: "/",
    });
  }, [language]);

  return <LanguageContext.Provider value={{ language: language, setLanguage: setLanguage, translation: translations[language] }} children={children} />;
};

export const useLang = () => {
  const context = React.useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return context;
};
