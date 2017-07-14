import axios, { AxiosResponse } from 'axios'
import config from 'utils/config'
const { baseURL } = config

export default async function request<T> (url: string, params?: T): Promise<AxiosResponse> {
  const response = await axios({ baseURL, url, params })
  response.data.success = response.data.code === 200
  return response
}
