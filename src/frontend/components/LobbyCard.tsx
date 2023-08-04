import React from 'react';
import trackExample from '~/frontend/assets/trackExample.jpeg';
import Image from 'next/image';
import playerIcon from '~/frontend/assets/playerIcon.svg';

const LobbyCard = () => {
  return (
    <div className="w-full aspect-[4/1] max-h-36 mb-2 bg-card rounded-xl flex ease-in duration-200 hover:brightness-75">
      <div className="relative grow">
        <Image
          src={trackExample}
          alt="example track image"
          className="rounded-bl-lg rounded-tl-lg h-full w-auto object-cover"
        />
        <div className="absolute bg-gradient-to-t from-black to-transparent rounded-bl-lg h-3 bottom-0 left-0 right-0">
          <p className="p-0 h-3 leading-3 text-center whitespace-nowrap">
            Tsukuba Circuit
          </p>
        </div>
      </div>

      <div className="relative w-3/4">
        {/* Width below must be less than width of parent element */}
        {/* Max width below is the parent element's widest width. Currently that value (parent) is ~3/4 of the widget's max width  */}
        <div className="ml-1 mt-[2px] w-[70vw] max-w-[550px]">
          <h4 className="text-ellipsis overflow-hidden whitespace-nowrap">
            All Welcome! Tuneeeeeees Street Cars On Street Tires Let&apos;s
            GOOO!!!
          </h4>
          <p className="text-subtext-color text-ellipsis overflow-hidden whitespace-nowrap">
            Hosted by: Mulssanne
          </p>
        </div>
        <div className="absolute bottom-1 left-0 right-1">
          <div className="hidden 2xs:flex justify-end gap-1 mb-1">
            <div className="rounded px-[2px] bg-card-section text-red-600">
              <p>Street: Soft</p>
            </div>
            <div className="rounded px-[2px] bg-card-section">
              <p>No Gr.</p>
            </div>
          </div>
          <div className="bg-card-section rounded-br-lg rounded-tr-lg flex items-center justify-between px-1 md:px-2 py-1">
            <div className="rounded-[5px] border w-fit flex items-center px-1">
              <p className="whitespace-nowrap">650 PP</p>
            </div>
            <div className="text-[#B1BCCC] items-center gap-1 hidden 2xs:flex ">
              <Image
                src={playerIcon}
                alt="player count icon"
                className="w-3 py-[1px]"
              />
              <p className="whitespace-nowrap">11 / 16</p>
            </div>
            <p className="text-subtext-color">88/88/8888 88:88PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyCard;
