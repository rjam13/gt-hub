import React, { SetStateAction } from 'react';
import { CldImage } from 'next-cloudinary';

interface Props {
  name: string;
  isSelected: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  image?: string;
}

const ManufacturerCard = ({ name, isSelected, onClick, image }: Props) => {
  return (
    <div
      className={`text-white hover:text-slate-300 border border-transparent hover:border-white w-[31%] aspect-square min-w-[110px] min-h-[110px] max-w-[250px] max-h-[250px] bg-card pt-4 pb-2.5 m-1 rounded-md grid grid-rows-[66%_33%] ${
        isSelected && 'text-slate-300 border-white'
      }`}
      onClick={onClick}
    >
      {/* 70 25 */}
      <CldImage
        src={image != null ? image : ''}
        alt={`${name} Logo`}
        width={400}
        height={400}
        className="h-full object-contain row-start-1 row-end-2 px-6"
      />
      <div className="grow flex items-center row-start-2 row-end-3">
        <p className="font-light m-auto">{name}</p>
      </div>
    </div>
  );
};

export default ManufacturerCard;
