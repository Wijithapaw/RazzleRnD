import { isServer } from "../utils/common.utils";
import { cookieStorageService } from "./cookie-storage.service";

const localStorageService = {
  getItem,
  setItem,
  clearItem,
};

const keyPrefix = "RAZZLE_DEMO";

const storage = !
isServer ? window.localStorage : undefined;

const storageKey = (key: string) => `${keyPrefix}_${key}`;

function getItem(key: string) {
  return storage.getItem(storageKey(key));
}

function setItem(key: string, value: string) {
  return storage.setItem(storageKey(key), value);
}

function clearItem(key: string) {
  storage.removeItem(storageKey(key));
}


export const storageService = cookieStorageService; // cookieStorageService | localStorageService