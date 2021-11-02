import Cookies from "universal-cookie";

let cookies = new Cookies();

export const cookieStorageService = {
  getItem,
  setItem,
  clearItem,
  setServerCookies
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

function setServerCookies(clientCookies) {
  cookies = clientCookies;
}
