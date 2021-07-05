import React from "react";
import style from "../../styles/modules/Button.module.scss";
import { Button as MuiButton, ButtonProps } from "@material-ui/core";
import { forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ ...rest }: ButtonProps, ref): JSX.Element => {
  return <MuiButton disableElevation disableRipple ref={ref} variant={"contained"} size={"large"} classes={{ root: style["button"] }} {...rest} />;
});

export const TextButton = forwardRef<HTMLButtonElement, ButtonProps>(({ ...rest }: ButtonProps, ref): JSX.Element => {
  return <Button variant={"text"} ref={ref} {...rest} />;
});

export default Button;
