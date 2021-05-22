import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

const Scrollbar: React.FC = ({ children }): JSX.Element => {
  return (
    <Scrollbars
      autoHide
      universal
      renderView={(props) => <div {...props} style={{ ...props.style, overflow: "hidden auto" }} />}
      renderThumbVertical={(props) => <div {...props} style={{ backgroundColor: "#333640" }} />}
      children={children}
    />
  );
};

export default Scrollbar;
