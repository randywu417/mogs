import axios, { AxiosRequestConfig } from "axios";
import { DOMAIN, HTTP_PORT } from "../types";

const fetch = async (path: string, config?: AxiosRequestConfig) => {
    const axiosConfig = {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
                ? `Bearer ${localStorage.getItem("token")}`
                : "",
        },
    };

    const response = await axios({
        method: "get",
        withCredentials: true,
        ...axiosConfig,
        ...config,
        url: DOMAIN + HTTP_PORT + path,
        data:
            typeof config?.data === "string"
                ? JSON.stringify(config.data)
                : config?.data,
    });

    if (response.status !== 200) {
        throw new Error(
            JSON.stringify({
                name: response.status,
                message: response.statusText,
            })
        );
    }

    return response;
};

export const get = async (path: string, config?: AxiosRequestConfig) => {
    const url = path;
    const init = { method: "get", url, ...config };
    return await fetch(path, init);
};

export const post = async (
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
) => {
    const url = path;
    const init = { method: "post", url, data, ...config };
    return await fetch(path, init);
};

export const put = async (
    path: string,
    data: unknown,
    config?: AxiosRequestConfig
) => {
    const url = path;
    const init = { method: "put", url, data, ...config };
    return await fetch(path, init);
};

export const _delete = async (
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig
) => {
    const url = path;
    const init = { method: "delete", url, data, ...config };
    return await fetch(path, init);
};

export default fetch;
