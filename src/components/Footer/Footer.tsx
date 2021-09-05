import { Locale } from "client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Footer.module.scss";
import { Select } from "../Input/Input";

const Footer: FC = (): JSX.Element => {
  const { translation, language, setLanguage } = useLang();
  const { validated } = useAuth();
  const router = useRouter();
  return (
    <footer className={style["container"]}>
      <Section>
        <div className={style["quick-nav"]}>
          <div className={style["title"]} children={translation.landing.quicknav.title} />
          <div className={style["columns"]}>
            {validated && <Column links={[{ name: translation.landing.quicknav.to_app, url: "/app" }]} />}
            {router.pathname !== "/" && <Column links={[{ name: translation.landing.quicknav.home, url: "/" }]} />}
            <Column links={[{ name: translation.landing.quicknav.signup, url: "/signup" }]} />
            <Column links={[{ name: translation.landing.quicknav.login, url: "/login" }]} />
          </div>
        </div>
      </Section>
      <Section>
        <div className={style["quick-nav"]}>
          <div className={style["title"]} children={translation.landing.api.title} />
          <div className={style["columns"]}>
            <Column links={[{ name: translation.landing.api.api, url: "https://api.tria.chat" }]} />
            <Column links={[{ name: translation.landing.api.docs, url: "https://github.com/WhySoBad/tria-backend#api" }]} />
          </div>
        </div>
      </Section>
      <Section>
        <div className={style["quick-nav"]}>
          <div className={style["title"]} children={translation.landing.source.title} id="github" />
          <div className={style["columns"]}>
            <Column links={[{ name: translation.landing.source.frontend, url: "https://github.com/WhySoBad/tria-frontend" }]} />
            <Column links={[{ name: translation.landing.source.backend, url: "https://github.com/WhySoBad/tria-backend" }]} />
            <Column links={[{ name: translation.landing.source.client, url: "https://github.com/WhySoBad/tria-client" }]} />
          </div>
        </div>
      </Section>
      <Section>
        <div className={style["footer-content"]}>
          <Select
            onChange={(event) => setLanguage(event.target.value as Locale)}
            values={[
              { value: "EN", label: translation.locales.EN },
              { value: "DE", label: translation.locales.DE },
              { value: "FR", label: translation.locales.FR, disabled: true },
            ]}
            value={language}
          />
          <div children={`Copyright © ${new Date().getFullYear()}`} />
        </div>
      </Section>
    </footer>
  );
};

const Section: FC = ({ children }): JSX.Element => <section className={style["footer-section"]} children={children} />;

interface ColumnProps {
  links: Array<{ name: string; url: string }>;
}

const Column: FC<ColumnProps> = ({ links }): JSX.Element => {
  return (
    <section className={style["column"]}>
      {links.map(({ name, url }, index: number) => {
        if (url.startsWith("/")) return <Link children={name} href={url} key={index} />;
        else return <a children={name} href={url} key={index} target={"_blank"} />;
      })}
    </section>
  );
};

export default Footer;
