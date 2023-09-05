import React, { MouseEventHandler } from 'react';
import ArrowIcon from '~/frontend/assets/arrow.svg';
import Link, { LinkProps } from 'next/link';
import Image from 'next/image';

interface Props extends LinkProps {
  text: string;
}

const ButtonLink = ({ text, href = '#', ...rest }: Props) => {
  return (
    <Link href={href} className="btn" {...rest}>
      {text}
      <Image src={ArrowIcon} alt="arrow icon" className="ml-[41px] h-full" />
    </Link>
  );
};

export default ButtonLink;
