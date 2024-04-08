import axios from 'axios'

export const api = axios.create({
  baseURL: '/'
})

export const apiAuth = axios.create({
  baseURL:'https://dotnet-map.fly.dev'
})


apiAuth.interceptors.response.use((response: any) => {
  return response;
}, (error: any) => {
  console.log(error);
  return error;
});