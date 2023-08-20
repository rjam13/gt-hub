import React, { MouseEventHandler } from 'react';
import Image, { StaticImageData } from 'next/image';
import exampleModel from '~/frontend/assets/porsche_911_Turbo_(930)_81.png';
import Link from 'next/link';

interface Props {
  name: string;
  href?: string;
  isSelected?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  image?: StaticImageData | string;
}

const CarModelEntry = ({ name, href, isSelected, onClick, image }: Props) => {
  return (
    <Link
      // javascript:; leads to no where
      href={typeof href != 'undefined' ? href : '#'}
      onClick={onClick}
      className={`text-white hover:text-slate-300 border border-transparent hover:border-white bg-card flex justify-start items-center rounded-md h-12 gap-2 mx-4 my-2 ${
        isSelected && 'text-slate-300 border-white'
      }`}
    >
      <div className="h-full w-4/12">
        <Image
          src={typeof image != 'undefined' ? image : exampleModel}
          alt="Car Model Example"
          className="h-full object-cover rounded-md"
        />
      </div>
      <p className="font-light w-8/12">{name}</p>
    </Link>
  );
};

export default CarModelEntry;
