import Link from "next/link";
import React, { FC } from "react";
import style from "../../styles/modules/Footer.module.scss";

const Footer: FC = (): JSX.Element => {
  return (
    <footer className={style["container"]}>
      <div className={style["content"]}>
        <div className={style["quick-nav"]}>
          <div className={style["title"]} children={"Quick Navigation"} />
          <div className={style["columns"]}>
            <Column links={[{ name: "To App", url: "/app" }]} />
            <Column links={[{ name: "Sign Up", url: "/signup" }]} />
            <Column links={[{ name: "Login", url: "/login" }]} />
          </div>
        </div>
        <div children={`Copyright © ${new Date().getFullYear()}`} />
      </div>
    </footer>
  );
};

interface ColumnProps {
  title?: string;
  links: Array<{ name: string; url: string }>;
}

const Column: FC<ColumnProps> = ({ title, links }): JSX.Element => {
  return (
    <section className={style["column"]}>
      <span className={style["column-title"]} children={title || ""} />
      {links.map(({ name, url }, index: number) => (
        <Link children={name} href={url} key={index} />
      ))}
    </section>
  );
};

export default Footer;
