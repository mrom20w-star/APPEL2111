export const ASSETS = {
  crashLogo: '/assets/crash-logo.jpg',
  appleHackLogo: '/assets/crash-logo.jpg',
  eagleLogo: '/assets/eagle-logo-CH_KbwXT.png',
  logoCrash: '/assets/logo-crash-DjCA49Xt.png',
  gameCrashEmblem: '/assets/game-crash-emblem-BoOLeHMv.png',
  gameCrashImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Kr0dFiHkTlnGvyHv6t3hSdBrHQHp6f-lFSIlYEsqqw&s=10',
};

export const WHITELIST_USER_IDS = ['1829018123', 'admin', 'vip', '123456'];
export const isWhitelistUser = (id?: string) =>
  Boolean(id && (WHITELIST_USER_IDS.includes(id.trim().toLowerCase()) || id.trim().length >= 6));

export const ACCESS_PASSWORD = 'MXG1';

export const FIREBASE_CRASH_URL =
  'https://x-men-256cc-default-rtdb.firebaseio.com/pre/hipr/hipr.json';
