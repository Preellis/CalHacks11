import { atom } from 'jotai';
import { TokenResponse } from '@react-oauth/google';

export const userAtom = atom<TokenResponse | null>(null);
export const userIdAtom = atom<string | null>(null);
