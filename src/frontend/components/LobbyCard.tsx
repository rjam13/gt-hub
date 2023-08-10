import React, { ReactNode } from 'react';
import trackExample from '~/frontend/assets/trackExample.jpeg';
import Image, { StaticImageData } from 'next/image';
import playerIcon from '~/frontend/assets/playerIcon.svg';
import Link from 'next/link';

// interface Props {
//   isPreset?: boolean;
//   trackName: string;
//   trackImg?: string | StaticImageData;
//   title: string;
//   creator: string;
//   tags: string[];
//   carRating: number | string; // number = pp rating, string = gr rating; if lobby has both, pp takes priority.
//   numberOfPlayers?: number;
//   startTime?: string;
//   href?: string;
// }
interface Props {
  isPreset?: boolean;
  trackName?: string;
  trackImg?: string | StaticImageData;
  title?: string;
  creator?: string;
  tags?: string[];
  carRating?: number | string; // number = pp rating, string = gr rating; if lobby has both, pp takes priority.
  numberOfPlayers?: number;
  startTime?: string;
  href?: string;
}

// isPreset = false,
// trackName = '',
// trackImg = trackExample,
// title,
// creator,
// tags,
// carRating,
// numberOfPlayers,
// startTime,
// href = '',
const LobbyCard = ({
  isPreset = false,
  trackName = 'Tsukuba Circuit',
  trackImg = trackExample,
  title = "All Welcome! Tuneeeeeees Street Cars On Street Tires Let's GOOO!!!",
  creator = 'Mulssanne',
  tags = ['Street: Soft', 'No Gr.'],
  carRating = 650,
  numberOfPlayers = 11,
  startTime = '88/88/8888 88:88PM',
  href = '/',
}: Props) => {
  return (
    <Link
      href={href}
      className="text-slate-100 w-full aspect-[4/1] max-h-36 mb-2 bg-card rounded-xl flex"
    >
      <div className="relative grow">
        <Image
          src={trackImg}
          alt="example track image"
          className="rounded-bl-lg rounded-tl-lg h-full w-auto object-cover"
        />
        <div className="absolute bg-gradient-to-t from-black to-transparent rounded-bl-lg h-3 bottom-0 left-0 right-0">
          <p className="p-0 h-3 leading-3 text-center whitespace-nowrap">
            {trackName}
          </p>
        </div>
      </div>

      <div className="relative w-3/4">
        {/* Width below must be less than width of parent element */}
        {/* Max width below is the parent element's widest width. Currently that value (parent) is ~3/4 of the widget's max width  */}
        <div className="ml-1 mt-[2px] w-[70vw] max-w-[550px]">
          <h4 className="text-ellipsis overflow-hidden whitespace-nowrap">
            {title}
          </h4>
          <p className="text-subtext-color text-ellipsis overflow-hidden whitespace-nowrap">
            {(isPreset ? 'Curated by: ' : 'Host: ') + creator}
          </p>
        </div>
        <div className="absolute bottom-1 left-0 right-1">
          <div className="hidden 2xs:flex justify-end gap-1 mb-1">
            {tags.map((tag, index) => {
              return (
                <div key={index} className="rounded px-[2px] bg-card-section">
                  <p>{tag}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-card-section rounded-br-lg rounded-tr-lg flex items-center justify-between px-1 md:px-2 py-1">
            <div className="rounded-[5px] border w-fit flex items-center px-1">
              <p className="whitespace-nowrap">
                {typeof carRating === 'number' ? carRating + ' PP' : carRating}
              </p>
            </div>
            {!isPreset && (
              <>
                <div className="text-[#B1BCCC] items-center gap-1 hidden 2xs:flex ">
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
      </div>
    </Link>
  );
};

export default LobbyCard;
