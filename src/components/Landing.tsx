import React from "react";
import { useLang } from "../hooks/LanguageContext";
import style from "../../styles/modules/Landing.module.scss";
import AnimatedBackground from "./AnimatedBackground";
import Footer from "./Footer";
import Header from "./Header";
import Scrollbar from "./Scrollbar";

const Landing = (): JSX.Element => {
  return (
    <main>
      <Header />
      <Scrollbar style={{ height: "100vh" }}>
        <AnimatedBackground />
        <Hero />
        <About />
        <Footer />
      </Scrollbar>
    </main>
  );
};

const Hero: React.FC = (): JSX.Element => {
  return (
    <section className={style["hero-container"]}>
      <div className={style["hero-title"]}>
        <h1 className={style["title-text"]} children={"Stay connected"} />
        <h2 className={style["subtitle-text"]} children={"Anywhere"} />
        <h2 className={style["subtitle-text"]} children={"Anytime"} />
        <h2 className={style["subtitle-text"]} children={"With Anybody"} />
      </div>
      <svg className={style["section-transition"]} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          className={style["fill"]}
          fillOpacity="1"
        ></path>
      </svg>
    </section>
  );
};

interface AboutProps {}

const About: React.FC<AboutProps> = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <section className={style["about-container"]}>
      <AboutSection replace={[{ title: "GitHub", scrollId: "github" }]} {...translation.landing.secure} />
      <AboutSection {...translation.landing.modern} />
      <AboutSection {...translation.landing.free} />
    </section>
  );
};

interface AboutSectionProps {
  title: string;
  description: string;
  replace?: Array<{ title: string; href?: string; scrollId?: string }>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, description, replace = [] }): JSX.Element => {
  const interpolate = (text: string, values: { [key: string]: JSX.Element }) => {
    const pattern: RegExp = /(%[a-zA-Z]+%)/g;
    const matches: Array<string> = text.match(pattern);
    const parts: Array<string> = text.split(pattern);

    if (!matches) return text;
    return parts.map((part: string, index: number) => <React.Fragment key={part + index} children={matches.includes(part) ? values[part] : part} />);
  };

  const getElementForPattern = (patterns: Array<{ title: string; href?: string; scrollId?: string }>): { [key: string]: JSX.Element } => {
    const obj: { [key: string]: JSX.Element } = {};

    patterns.map(({ title, href, scrollId }) => {
      const linkEl: JSX.Element = <a className={style["link"]} href={href} children={title} />;
      const scrollEl: JSX.Element = (
        <span
          className={style["link"]}
          onClick={() => {
            const el = document.getElementById(scrollId + "");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          children={title}
        />
      );
      obj[`%${title}%`] = href ? linkEl : scrollId ? scrollEl : <>{title}</>;
    });
    return obj;
  };

  return (
    <div className={style["topic-container"]}>
      <h5 className={style["title"]} children={title} />
      <div className={style["text"]} children={interpolate(description, getElementForPattern(replace))} />
    </div>
  );
};

export default Landing;
