import React, { MouseEventHandler } from 'react';
import ArrowIcon from '~/frontend/assets/arrow.svg';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  text: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Button = ({ text, href = '', onClick }: Props) => {
  return href != '' ? (
    <Link href={href} className="btn">
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
    </Link>
  ) : (
    <div className="btn" onClick={onClick}>
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
    </div>
  );
};

export default Button;
