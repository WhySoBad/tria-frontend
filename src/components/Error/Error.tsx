import React from "react";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import style from "../../styles/modules/Error.module.scss";
import Button from "../Button/Button";

interface ErrorProps {
  code: number;
  text: string;
}

const Error: React.FC<ErrorProps> = ({ code, text }): JSX.Element => {
  const title: string = code === 404 ? "Page Not Found" : "Server Side Error";
  return (
    <>
      <AnimatedBackground />
      <div className={style["container"]}>
        <h4 children={title} />
        <div className={style["text"]} children={text} />
        <div className={style["button"]} children={<Button children={"Back To Home"} />} />
      </div>
    </>
  );
};

export default Error;
