import React, { MutableRefObject } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import style from "../../styles/modules/Layout.module.scss";

interface ScrollbarProps {
  reference?: MutableRefObject<Scrollbars>;
}

const Scrollbar: React.FC<ScrollbarProps> = ({ children, reference }): JSX.Element => {
  return (
    <Scrollbars
      ref={reference}
      autoHide
      universal
      renderView={(props) => <div {...props} style={{ ...props.style, overflow: "hidden auto" }} />}
      renderThumbVertical={(props) => <div {...props} className={style["scroll-thumb"]} />}
      children={children}
    />
  );
};

export default Scrollbar;
