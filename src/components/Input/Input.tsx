import React, { FC } from 'react';
import style from '../../styles/modules/Input.module.scss';

type InputTypes =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  type?: InputTypes;
  error?: boolean;
  onEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: FC<Props> = ({
  className,
  error,
  onKeyPress,
  onEnter,
  ...rest
}): JSX.Element => {
  return (
    <span className={className}>
      <input
        className={style['base-input']}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          onKeyPress && onKeyPress(event);
          if (event.key === 'Enter' && onEnter) onEnter(event);
        }}
        {...rest}
        data-error={error}
      />
    </span>
  );
};

export default Input;
