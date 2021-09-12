import { Button as MuiButton, ButtonProps } from "@material-ui/core";
import React, { forwardRef } from "react";
import style from "../styles/modules/Button.module.scss";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ ...rest }: ButtonProps, ref): JSX.Element => {
  return <MuiButton disableElevation disableRipple ref={ref} variant={"contained"} size={"large"} classes={{ root: style["button"] }} {...rest} />;
});

export const TextButton = forwardRef<HTMLButtonElement, ButtonProps>(({ disabled, ...rest }: ButtonProps, ref): JSX.Element => {
  return <span className={style["text-button"]} aria-disabled={disabled} children={<span ref={ref} {...rest} />} />;
});

export default Button;
