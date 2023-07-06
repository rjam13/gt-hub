import React from 'react';
import ArrowIcon from '~/frontend/assets/arrow.svg';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  text: string;
  href: string;
}

const Button = ({ text, href }: Props) => {
  return (
    <Link href={href} className="btn">
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
      {/* <div className="ml-[41px] my-0 h-full aspect-10/13 ">
        <ArrowIcon height="100%" width="100%" viewBox="0 0 10 13" />
      </div> */}
    </Link>
  );
};

export default Button;
