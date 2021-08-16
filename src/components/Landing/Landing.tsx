import React from "react";
import { useLang } from "../../hooks/LanguageContext";
import style from "../../styles/modules/Landing.module.scss";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Scrollbar from "../Scrollbar/Scrollbar";

const Landing = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <main>
      <title children={translation.sites.home} />
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
    </section>
  );
};

interface AboutProps {}

const About: React.FC<AboutProps> = (): JSX.Element => {
  const { translation } = useLang();
  return (
    <section className={style["about-container"]}>
      <AboutSection {...translation.landing.secure} />
      <AboutSection {...translation.landing.modern} />
      <AboutSection {...translation.landing.free} />
    </section>
  );
};

interface AboutSectionProps {
  title: string;
  description: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, description }): JSX.Element => {
  return (
    <div className={style["topic-container"]}>
      <h5 className={style["title"]} children={title} />
      <div className={style["text"]} children={description} />
    </div>
  );
};

export default Landing;
