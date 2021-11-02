import Cookies from "universal-cookie";
import { isServer } from "../utils/common.utils";

let cookies = new Cookies();

export function setServerCookies(x) {
  //console.log('setting cookie', x);  
  cookies = new Cookies(x);
}

export function setServerCookies2(x) {
  // console.log('setting cookie', cookies);  
  cookies = x;
}

export const cookieStorageService = {
  getItem,
  setItem,
  clearItem,
};

const keyPrefix = "RAZZLE_DEMO";

const storageKey = (key: string) => `${keyPrefix}_${key}`;

function getItem(key: string) {
  return cookies.get(storageKey(key));
}

function setItem(key: string, value: string) {
  return cookies.set(storageKey(key), value);
}

function clearItem(key: string) {
  cookies.remove(storageKey(key));
}
