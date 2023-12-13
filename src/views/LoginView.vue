<template>
  <div class="logoWrap">
    <img src="/img/logo.jpg" alt="" />
    <div class="loginWrap">
      <div class="loginImg">
        <img src="/img/logoIcon.png" alt="" />
      </div>
      <n-space vertical>
        <div class="loginInputWrap">
          <n-input
            v-model:value="user.username"
            placeholder="Username"
            id="username"
            @keydown.enter="onSubmit()"
            :maxlength="20"
            class="loginInputStyle"
            size="large"
          >
            <template #prefix>
              <n-icon :component="People" />
            </template>
          </n-input>
        </div>
        <div class="loginInputWrap">
          <n-input
            v-model:value="user.password"
            type="password"
            show-password-on="click"
            placeholder="Password"
            :maxlength="20"
            size="large"
            class="loginInputStyle"
            id="password"
            @keydown.enter="onSubmit"
          >
            <template #prefix>
              <n-icon :component="LockOpen" />
            </template>
          </n-input>
        </div>
      </n-space>
      <div class="loginBtnWrap">
        <button @click="onSubmit">登入</button>
        <div class="visitorWrap">
          <div>
            <span><div></div></span>
            <p>或</p>
            <span><div></div></span>
          </div>
          <p @click="visitorSubmit">使用訪客登入</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { People, LockOpen } from "@vicons/ionicons5";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import {useRouter } from "vue-router";

const userPinia = useUserStore();
const { loginStatus } = storeToRefs(userPinia);
const router = useRouter();

/**
 * 帳號 密碼
 */
const user = ref({ username: "", password: "" } as {
  username: string;
  password: string;
});

/**
 * 登入
 */
const onSubmit = () => {
  loginStatus.value = true;
  //還缺一個API 或是 一個認證
};

/**
 * 以訪客名義
 */
const visitorSubmit = () => {
  loginStatus.value = false;
  router.push("/home");
};
</script>
