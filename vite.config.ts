import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const server_port = 2076;
// const proxy_api = 'http://localhost:5276';
const proxy_api = 'https://dotnet-map.fly.dev';


// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }, 
  },
  server: {
    host: '127.0.0.1',
    port: server_port,
    //指定後端Server位置
    proxy: {
      '/api': {
        target: proxy_api, //若Server在本機 則定為 localhost:5276
      },
    },
  },
  preview: {
    port: server_port,
  },
});
