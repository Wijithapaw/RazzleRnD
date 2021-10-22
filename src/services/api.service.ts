import axios, { AxiosRequestConfig, Method } from "axios";
import * as queryString from "query-string";

console.log("API URL: " + process.env.RAZZLE_API_URL);
console.log("Node ENV: " + process.env.NODE_ENV);
console.log("Port: " + process.env.PORT);
console.log("Secret code : " + process.env.RAZZLE_SECRET_CODE);

const axiosInstance = axios.create({
  baseURL: process.env.RAZZLE_API_URL,
});
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const apiService = {
  get,
  post,
  put,
  patch,
  delete: deleteRecord,
};

function get<T>(
  controller: string,
  action: string = "",
  urlParams: string[] = [],
  queryParams: any = null,
  showGlobalSpinner = false,
  requestName: string = ""
) {
  return apiRequest<T>(
    "get",
    controller,
    action,
    null,
    urlParams,
    queryParams,
    showGlobalSpinner,
    requestName
  );
}

function post<T>(
  controller: string,
  action: string = "",
  data: any,
  urlParams: string[] = [],
  queryParams: any = null,
  showGlobalSpinner = false
) {
  return apiRequest<T>(
    "post",
    controller,
    action,
    data,
    urlParams,
    queryParams,
    showGlobalSpinner
  );
}

function put<T>(
  controller: string,
  action: string = "",
  data: any,
  urlParams: string[] = [],
  queryParams: any = null,
  showGlobalSpinner = false
) {
  return apiRequest<T>(
    "put",
    controller,
    action,
    data,
    urlParams,
    queryParams,
    showGlobalSpinner
  );
}

function patch<T>(
  controller: string,
  action: string = "",
  data: any,
  urlParams: string[] = [],
  queryParams: any = null,
  showGlobalSpinner = false
) {
  return apiRequest<T>(
    "patch",
    controller,
    action,
    data,
    urlParams,
    queryParams,
    showGlobalSpinner
  );
}
function deleteRecord(
  controller: string,
  action: string = "",
  urlParams: string[] = [],
  queryParams: any = null,
  showGlobalSpinner = false
) {
  return apiRequest<any>(
    "delete",
    controller,
    action,
    null,
    urlParams,
    queryParams,
    showGlobalSpinner
  );
}

function apiRequest<T>(
  method: Method,
  controller: string,
  action: string = "",
  data: any,
  urlParams: string[] = [],
  queryParams: any = null,
  showGlobalSpinner = false,
  requestName: string = ""
) {
  let url = createUrl(controller, action, urlParams, queryParams);
  let options = createRequestOptions(url, method, data);

  return axiosInstance
    .request<T>(options)
    .then((res) => res && res.data)
    .catch((error) => {
      throw error;
    });
}

function createUrl(
  controller: string,
  action: string = "",
  urlParams: string[] = [],
  queryParams: any = null
) {
  let url = controller + (action ? "/" + action : "");

  urlParams.forEach((param) => {
    url += "/" + param;
  });

  let params = "";
  if (queryParams) {
    params += "?" + queryString.stringify(queryParams);
  }

  return (url += params);
}

function createRequestOptions(
  url: string,
  method: Method,
  data: any,
  responseType?: any
) {
  const authToken = localStorage.getItem("AUTH_TOKEN");

  const options: AxiosRequestConfig = {
    url,
    method,
    data,
    headers: {
      Authorization: "bearer " + authToken,
      "Client-Application": "WEB",
    },
  };

  if (responseType) {
    options.responseType = responseType;
  }

  return options;
}
