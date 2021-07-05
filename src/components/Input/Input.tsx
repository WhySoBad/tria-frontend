import React, { forwardRef } from "react";
import style from "../../styles/modules/Input.module.scss";
import { InputBase, InputBaseProps, InputAdornment, IconButton, Checkbox as MuiCheckbox, CheckboxProps } from "@material-ui/core";
import { Search as SearchIcon, Tune as TuneIcon } from "@material-ui/icons";

export const Input = forwardRef<HTMLInputElement, InputBaseProps>(({ ...rest }, ref): JSX.Element => {
  return <InputBase spellCheck={false} ref={ref} classes={{ root: style["input"], error: style["error"], disabled: style["disabled"], focused: style["focus"] }} {...rest} />;
});

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ ...rest }, ref): JSX.Element => {
  return <MuiCheckbox ref={ref} TouchRippleProps={{ color: "#fff" }} classes={{ root: style["checkbox"], colorSecondary: style["secondary"] }} {...rest} />;
});

interface SearchbarProps extends InputBaseProps {
  onTuneOpen?: () => void;
}

export const Searchbar: React.FC<SearchbarProps> = ({ onTuneOpen, ...props }): JSX.Element => {
  return (
    <div className={style["searchbar-container"]}>
      <InputBase
        className={style["searchbar"]}
        spellCheck={false}
        {...props}
        endAdornment={
          <InputAdornment position={"end"}>
            <IconButton disableRipple onClick={onTuneOpen} classes={{ root: style["iconbutton"] }}>
              <TuneIcon className={style["icon"]} />
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default Input;
