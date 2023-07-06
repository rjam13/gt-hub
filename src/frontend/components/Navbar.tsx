import React from 'react';

interface Props {
  absolute?: boolean;
}

const Navbar = ({ absolute = false }: Props) => {
  return (
    <div
      className={
        (absolute ? 'absolute z-50 top-0 left-0 right-0' : null) +
        ' px-7 py-5 flex justify-between items-center'
      }
    >
      <h1>GT Hub</h1>
      <div className="w-[21px] h-[17px] flex flex-col justify-between">
        <div className="h-[2px] bg-white" />
        <div className="h-[2px] bg-white" />
        <div className="h-[2px] bg-white" />
      </div>
    </div>
  );
};

export default Navbar;
