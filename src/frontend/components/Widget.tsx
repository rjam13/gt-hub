import Link from 'next/link';
import React, { ReactNode } from 'react';
import Image from 'next/image';
import arrowIcon from '~/frontend/assets/arrow.svg';

interface Props {
  children?: ReactNode;
  header: string;
  text?: string;
  href?: string;
  className?: string;
  onClose?: () => void;
}

const Widget = ({
  children,
  header,
  text,
  href = '',
  className,
  onClose,
}: Props) => {
  return (
    <div
      className={`relative bg-widget-gradient shadow-widget rounded-md sm:mx-4 mb-5 max-w-3xl ${className}`}
    >
      {/* X in the corner for closing.
       if onClose is undefined, this is not used. onClose should have some setState function */}
      {typeof onClose != 'undefined' && (
        <button
          className="absolute -top-2 -right-2 flex justify-center rounded-full h-8 w-8 bg-gray-600 cursor-pointer shadow-xl"
          onClick={() => {
            if (typeof onClose != 'undefined') onClose();
          }}
          title="Bye bye"
        >
          <span className="text-2xl leading-7 select-none">&times;</span>
        </button>
      )}

      <div className="my-3 mx-4">
        <div className="flex justify-between">
          <h2>{header}</h2>
          {href ? (
            <Link href={href} className="flex items-center">
              View More
              <Image src={arrowIcon} className="ml-1.5" alt="arrow icon" />
            </Link>
          ) : null}
        </div>
        <div className="h-px bg-white/20 -mx-1" />
        <p>{text}</p>
      </div>

      <div>{children}</div>
    </div>
  );
};

export default Widget;
