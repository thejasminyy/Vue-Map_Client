import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

enum language {
  Chinese_tw = 'zh_tw',
  English = 'en_ww',
  Chinese_cn = 'zh_cn'
}

export const api = axios.create({
  baseURL: '/'
})

export const apiAuth = axios.create({
  baseURL: '/'
})

export const apiAuthForBlob = axios.create({
  baseURL: '/',
  responseType: 'blob'
})

apiAuth.interceptors.request.use((config: any): any => {
  const user = useUserStore()
  config.headers.authorization = `Bearer ${user.token}`
  return config
})

let alertShown = false;

apiAuth.interceptors.response.use((response: any) => {
  return response;
}, (error: any) => {
  console.log(error);
  return error;
});

apiAuthForBlob.interceptors.request.use((config: any): any => {
  const user = useUserStore()
  config.headers.authorization = `Bearer ${user.token}`
  return config
})

apiAuthForBlob.interceptors.response.use((response: any) => {
  return response;
}, (error: any) => {
  console.error(error);
});