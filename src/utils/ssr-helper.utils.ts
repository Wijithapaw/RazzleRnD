import { isServer } from "./common.utils";

let initialData;

export function setInitialData(data) {
    initialData = data
}

export function clearServerLoadedData(path: string) {
    const dataKey = getInitialDataKey(path);
    if(!isServer && window[dataKey]) {
        window[dataKey] = undefined;
    }
}

export function getInitialData(path: string) {
    const dataKey = getInitialDataKey(path);
    if(!isServer && window[dataKey]) {
        return window[dataKey];
    }
    return initialData
}

export function getInitialDataKey(path: string) {   
    return `_INITIAL_DATA_${path.toUpperCase().replace("/", "_")}`;
}