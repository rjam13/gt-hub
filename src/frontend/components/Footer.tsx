import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import discordLogo from '~/frontend/assets/discord.svg';
import githubLogo from '~/frontend/assets/github.svg';
import youtubeLogo from '~/frontend/assets/youtube.svg';

const Footer = () => {
  const socials = [
    { href: '/', logo: discordLogo, alt: 'discord logo' },
    { href: '/', logo: githubLogo, alt: 'github logo' },
    { href: '/', logo: youtubeLogo, alt: 'youtube logo' },
  ];
  return (
    <div className="w-full h-52 flex flex-col items-center justify-end pb-6 gap-6">
      <div className="flex justify-center gap-3">
        {socials.map(({ href, logo, alt }, index) => (
          <Link
            href={href}
            key={index}
            className="aspect-square h-9 hover:opacity-50"
          >
            <Image src={logo} alt={alt} className="h-full" />
          </Link>
        ))}
      </div>
      <p>© GT Hub 2023. All rights reserved.</p>
    </div>
  );
};

export default Footer;
