import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
    state() {
        return {
            loginStatus:false as boolean, //登入狀態 false未登入 true訪客
        };
      },
    actions: {

    }
  })