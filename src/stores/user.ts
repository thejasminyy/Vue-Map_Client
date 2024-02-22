import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', {
    state() {
        return {
          /** 登入狀態 false未登入 true訪客 */
            loginStatus:false as boolean,
            userName:''as string,
        };
      },
    actions: {
      /** 初始化登入資訊 */
      initLoginData(){
        this.loginStatus = false;
        this.userName = "";
        sessionStorage.clear();
      }
    },
    persist: {
      // 只存取 loginStatus
      strategies: [
        {
          paths: ['loginStatus','userName'],
        },
      ],
    },
  })