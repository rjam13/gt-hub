import sha256 from 'crypto-js/sha256';
import { getSession } from 'next-auth/react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types';

export const createUsername = (): string => {
  const a = [
    'speedy',
    'quick',
    'swift',
    'brisk',
    'nimble',
    'lively',
    'sprightly',
    'turbo',
    'supercharged',
  ];
  const b = ['racer', 'speedster', 'driver'];
  const rA = Math.floor(Math.random() * a.length);
  const rB = Math.floor(Math.random() * a.length);
  const prefix = a[rA] as string;
  const suffix = b[rB] as string;
  return prefix + suffix + String(Math.floor(Math.random() * 1000));
};

export const hashPassword = (password: string) => {
  return sha256(password).toString();
};
