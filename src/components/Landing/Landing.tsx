import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import style from "../../styles/modules/Landing.module.scss";
import Scrollbar from "../Scrollbar/Scrollbar";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";

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
    </section>
  );
};

interface AboutProps {}

const textb = "NAME is a messenger to let you communicate with other people over the web. NAME is available for free for anybody connected to the internet.";

const About: React.FC<AboutProps> = (): JSX.Element => {
  return (
    <section className={style["about-container"]}>
      <AboutSection name={"Secure"} />
      <AboutSection name={"Modern"} />
      <AboutSection name={"Free"} />
    </section>
  );
};

interface AboutSectionProps {
  name: string;
}

const captions = {
  free: "Register a free account and start chatting with the world",
  modern: "NAME is built with latest frameworks to profide the best experience",
  secure: "NAME is encrypted over TLS and the whole source code is public visible on GitHub",
  /* security:
    "In order to make the messenger available on any device over the web NAME isn't secured with end-to-end encryption. This doesn't mean the data isn't protected at all - the backend and the frontend are secured with TLS. Additionally the source code of the messenger is public available on GitHub.",
  frameworks: "NAME is built with modern frameworks. The backend is built with Nest running with Express and the frontend is built with Next to gain all the benefits of server-side-rendering. ",
 */
};

const AboutSection: React.FC<AboutSectionProps> = ({ name }): JSX.Element => {
  return (
    <div className={style["topic-container"]}>
      <h5 className={style["title"]} children={name} />
      <div className={style["text"]} children={captions[name.toLowerCase()]} />
    </div>
  );
};

export default Landing;
