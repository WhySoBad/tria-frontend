import React from "react";
import { Snackbar as MuiSnackbar, SnackbarProps as MuiSnackbarProps } from "@material-ui/core";
import { forwardRef } from "react";

interface SnackbarProps extends MuiSnackbarProps {}

const Snackbar: React.FC<SnackbarProps> = forwardRef(({ onClose, children, ...rest }, ref): JSX.Element => {
  return (
    <MuiSnackbar
      ref={ref}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      autoHideDuration={2500}
      onClose={(event, reason) => reason !== "clickaway" && onClose && onClose(event, reason)}
      {...rest}
      children={children}
    />
  );
});

export default Snackbar;
