import { isServer } from "./common.utils";

let initialData;

export function setInitialData(data) {
    initialData = data
}

export function clearServerLoadedData(path: string) {
    const dataKey = getInitialDataKey(path);
    if(!isServer && window[dataKey]) {
        console.log('clearing serer loaded data', window[dataKey]);        
        window[dataKey] = undefined;
    }
}

export function getInitialData(path: string) {
    const dataKey = getInitialDataKey(path);
    if(!isServer && window[dataKey]) {
        console.log('client initial data', window[dataKey]);        
        return window[dataKey];
    }
    console.log('server initial data', initialData);
    return initialData
}

export function getInitialDataKey(path: string) {   
    return `_INITIAL_DATA_${path.toUpperCase().replace("/", "_")}`;
}