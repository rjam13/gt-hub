import React, { ButtonHTMLAttributes, MouseEventHandler } from 'react';
import ArrowIcon from '~/frontend/assets/arrow.svg';
import Link from 'next/link';
import Image from 'next/image';

interface Props extends React.HTMLProps<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  text: string;
}

const Button = ({
  type = 'button',
  text,
  onClick,
  disabled,
  ...rest
}: Props) => {
  return (
    <button
      type={type}
      className="btn"
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
    </button>
  );
};

export default Button;
