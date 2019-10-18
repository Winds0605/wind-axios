import xhr from './xhr'
import { AxiosRequestConfig } from './types'
import { buildURL } from './helpers/url'
import { transformRequest } from './helpers/data'

function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transformRequestData(config)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  // 返回一个处理后的url
  return buildURL(url, params)
}

function transformRequestData(config: AxiosRequestConfig) {
  return transformRequest(config.data)
}

export default axios