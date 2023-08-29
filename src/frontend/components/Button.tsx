import React, { MouseEventHandler } from 'react';
import ArrowIcon from '~/frontend/assets/arrow.svg';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  text: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button = ({ text, href = '', onClick, disabled }: Props) => {
  return href != '' ? (
    <Link href={href} className="btn">
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
    </Link>
  ) : (
    <button className="btn" onClick={onClick} disabled={disabled}>
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
    </button>
  );
};

export default Button;
