import { deepMerge, isPlainObject } from './util'
import { Method } from '../types'

function normalizeHeaderName(headers: any, normalizeName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach((name: string): void => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  // headers属性格式转换
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    // headers的属性大小写不敏感
    // 但headers['Content-Type']指定了查找格式 所以需要对格式进行转换
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  // 创建一个空对象
  let parsed = Object.create(null)

  // 如果没有headers返回一个空对象
  if (!headers) {
    return parsed
  }

  // getAllResponseHeaders返回的是字符串 每一行以回车符和换行符结尾（\r\n）
  headers.split('\r\n').forEach(line => {
    // 将key val以 ':' 符号分割
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }

  // 将headers中对应方法中的字段、common中字段、headers中其他字段合并
  headers = deepMerge(headers[method], headers.common, headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
