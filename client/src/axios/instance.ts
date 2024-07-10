import axios, { AxiosRequestConfig } from "axios"
import config from "../config"

const baseReqConfig: AxiosRequestConfig = {
    baseURL: config.BASE_API_URL,
    headers: {
        Accept: 'Application/json',
        'Content-Type': 'Application/json'
    },
}

export const baseInstance = axios.create(baseReqConfig)
