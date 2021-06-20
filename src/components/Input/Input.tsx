import React from "react";
import style from "../../styles/modules/Input.module.scss";
import { InputBase, InputBaseProps, InputAdornment } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";

type InputTypes =
  | "button"
  | "checkbox"
  | "color"
  | "date"
  | "datetime-local"
  | "email"
  | "file"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "reset"
  | "search"
  | "submit"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  type?: InputTypes;
  error?: boolean;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ className, error, onKeyPress, onEnter, ...rest }): JSX.Element => {
  return (
    <span className={className}>
      <input
        className={style["base-input"]}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          onKeyPress && onKeyPress(event);
          if (event.key === "Enter" && onEnter) onEnter(event);
        }}
        {...rest}
        data-error={error}
      />
    </span>
  );
};

interface SearchbarProps extends InputBaseProps {}

export const Searchbar: React.FC<SearchbarProps> = ({ ...props }): JSX.Element => {
  return (
    <div className={style["searchbar-container"]}>
      <InputBase className={style["searchbar"]} spellCheck={false} {...props} endAdornment={<InputAdornment position={"end"} children={<SearchIcon className={style["icon"]} />} />} />
    </div>
  );
};

export default Input;
