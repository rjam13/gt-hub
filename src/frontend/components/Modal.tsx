import React, { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  open?: boolean;
  onClose: () => void;
}

const Modal = ({ children, open = true, onClose }: Props) => {
  return (
    // `inset-0` to stretch over the entire screen
    <div
      className={
        `fixed inset-0 z-10 p-8 bg-black/[0.6]
        ${open ? 'block' : 'hidden'}` // control visibility via `open` attribute (or render conditionally)
      }
    >
      {/* container: `mx-auto` to center horizontally */}
      <div className="relative mx-auto w-fit mt-8">
        {/* X in the corner */}
        <button
          className="absolute -top-2 -right-2 flex justify-center rounded-full h-8 w-8 bg-gray-600 cursor-pointer shadow-xl"
          onClick={() => onClose()}
          title="Bye bye"
        >
          <span className="text-2xl leading-7 select-none">&times;</span>
        </button>
        {/* contents */}
        <div className="overflow-hidden bg-gray-800 rounded shadow-xl px-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
