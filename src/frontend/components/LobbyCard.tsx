import React, { ReactNode } from 'react';
import trackExample from '~/frontend/assets/trackExample.jpeg';
import Image, { StaticImageData } from 'next/image';
import playerIcon from '~/frontend/assets/playerIcon.svg';
import Link from 'next/link';
import { camelCaseToWords } from '~/utils/misc';

// Important: These props are primarily based off the attributes
// in the Prisma model lobbySettings.
interface Props {
  isPreset?: boolean;
  //below are trackLayouts where name = track layout name and trackName = track name
  tracks: { name: string; trackName: string }[];
  trackImg?: string | StaticImageData;
  title: string;
  creator: string; // curator
  tags: string[];
  carRating: number | string; // number = pp rating, string = gr rating; if lobby has both, pp takes priority.
  numberOfPlayers?: number;
  startTime?: string;
  href?: string;
}

const LobbyCard = ({
  isPreset = false,
  tracks = [],
  trackImg = trackExample,
  title,
  creator,
  tags,
  carRating,
  numberOfPlayers,
  // startTime,
  startTime = '88/88/8888 88:88PM',
  // href = '',
  href = '/',
}: Props) => {
  return (
    <Link
      href={href}
      className="text-slate-100 w-full mb-2 bg-card rounded-xl flex"
    >
      <div className="relative grow flex flex-col">
        <Image
          src={trackImg}
          alt="example track image"
          className="rounded-tl-lg grow w-auto object-cover"
        />
        {tracks?.length > 0 && (
          <>
            <div className="bg-gradient-to-b from-black to-black rounded-tl-lg top-0 left-0 right-0">
              <p className="p-0 text-center">
                {tracks[0]?.trackName + ': ' + tracks[0]?.name}
              </p>
            </div>
            <div className="bg-gradient-to-t from-black to-transparent rounded-bl-lg bottom-0 left-0 right-0">
              <p className="p-0 text-center">{tracks.length} Tracks Total</p>
            </div>
          </>
        )}
      </div>

      <div className="relative w-3/4 flex flex-col">
        {/* Width below must be less than width of parent element */}
        {/* Max width below is the parent element's widest width. Currently that value (parent) is ~3/4 of the widget's max width  */}
        <div className="flex-grow ml-1 mt-[2px] w-[70vw] max-w-[550px]">
          <h4 className="text-ellipsis overflow-hidden whitespace-nowrap">
            {title}
          </h4>
          <p className="text-subtext-color text-ellipsis overflow-hidden whitespace-nowrap">
            {(isPreset ? 'Curated by: ' : 'Host: ') + creator}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-1 mb-1 mr-1">
          {tags?.map((tag, index) => {
            return (
              <div key={index} className="rounded px-[2px] bg-card-section">
                <p>{camelCaseToWords(tag)}</p>
              </div>
            );
          })}
        </div>
        <div className="bg-card-section rounded-br-lg rounded-tr-lg flex items-center justify-between px-1 md:px-2 py-1 mb-1 mr-1">
          <div className="rounded-[5px] border w-fit flex items-center px-1">
            <p className="whitespace-nowrap">
              {typeof carRating === 'number' ? carRating + ' PP' : carRating}
            </p>
          </div>
          {!isPreset && (
            <>
              <div className="text-[#B1BCCC] items-center gap-1 flex ">
                <Image
                  src={playerIcon}
                  alt="player count icon"
                  className="w-3 py-[1px]"
                />
                <p className="whitespace-nowrap">{numberOfPlayers} / 16</p>
              </div>
              <p className="text-subtext-color">{startTime}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LobbyCard;
