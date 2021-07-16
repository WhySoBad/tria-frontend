import React, { MutableRefObject } from "react";
import Scrollbars, { ScrollbarProps as Props } from "react-custom-scrollbars-2";
import style from "../../styles/modules/Layout.module.scss";

interface ScrollbarProps extends Props {
  reference?: MutableRefObject<Scrollbars>;
  withPadding?: boolean;
  withMargin?: boolean;
}

const Scrollbar: React.FC<ScrollbarProps> = ({ children, withPadding = true, withMargin = true, reference, ...props }): JSX.Element => {
  return (
    <Scrollbars
      ref={reference}
      autoHide
      universal
      renderView={(props) => <div {...props} style={{ ...props.style, overflow: "hidden auto", paddingRight: withPadding && "17px", marginRight: !withMargin ? "0px !important" : "-17px" }} />}
      renderThumbVertical={(props) => <div {...props} className={style["scroll-thumb"]} />}
      children={children}
      {...props}
    />
  );
};

export default Scrollbar;
