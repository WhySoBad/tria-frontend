import React, { useEffect, useState } from "react";
import Fade from "../Fade/Fade";
import Footer from "./Footer";
import Header from "./Header";
import style from "../../styles/modules/Landing.module.scss";
import Scrollbar from "../Scrollbar/Scrollbar";
import Button from "../Button/Button";

const Landing = (): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <>
      <Header />
      <Scrollbar style={{ height: "100vh" }}>
        <Hero />
        <div style={{ height: "100vh" }} />

        <Footer />
      </Scrollbar>
    </>
  );
};

const Hero: React.FC = (): JSX.Element => {
  return (
    <section className={style["hero-container"]}>
      <div className={style["hero-title"]}>
        <h1 className={style["title-text"]}>Stay connected</h1>
        <h2 className={style["subtitle-text"]} children={"Anywhere"} />
        <h2 className={style["subtitle-text"]} children={"Anytime"} />
        <h2 className={style["subtitle-text"]} children={"With Anybody"} />
      </div>
    </section>
  );
};

const Navigation: React.FC = (): JSX.Element => {
  return (
    <section className={style["navigation-container"]}>
      <Button children={"Login"} />
      <Button children={"Signup"} />
      <Button children={"To App"} />
    </section>
  );
};

const NavigationItem: React.FC = (): JSX.Element => {
  return <div className={style["navigation-container-item"]}></div>;
};

const captions = {
  modern: "",
  secure: "",
};

const Sections: React.FC = (): JSX.Element => {
  return (
    <section className={style["sections-container"]}>
      <Section index={"modern"} />
      <Section index={"secure"} />
    </section>
  );
};

interface SectionProps {
  index: string;
}

const Section: React.FC<SectionProps> = ({ index }): JSX.Element => {
  const title: string = index.length > 1 ? index.substr(0, 1).toUpperCase() + index.substr(1) : index.toUpperCase();

  return (
    <section className={style["section-container"]}>
      <h4 className={style["title"]} children={title} />
      <div className={style["text"]} children={captions[index]} />
    </section>
  );
};

export default Landing;
