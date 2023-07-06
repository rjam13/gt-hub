import sha256 from 'crypto-js/sha256';
import crypto from 'crypto';

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

export const signUp = () => {
  const callbackUrl = window.location.href;
  window.location.href = `/auth/signup?${new URLSearchParams({
    callbackUrl,
  })}`;
};

export const comparePassword = (password: string, salt: string) => {
  return sha256(salt + password).toString();
};

export const newPassword = (
  password: string,
): {
  salt: string;
  passwordHash: string;
} => {
  const salt = createSalt();
  return {
    salt: salt,
    passwordHash: sha256(salt + password).toString(),
  };
};

const createSalt = () => {
  const buf = new Uint32Array(10);
  crypto.getRandomValues(buf);
  return buf.toString().replace(/\,/g, '');
};
