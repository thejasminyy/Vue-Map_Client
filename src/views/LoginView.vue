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
import { useRouter } from "vue-router";
import { apiAuth, AxiosResponse } from "@/plugins/axios";
import { useMessage } from "naive-ui";

const message = useMessage();
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
const onSubmit = async () => {
  if (user.value.username === "" && user.value.password === "") {
    message.error("請輸入帳號或密碼");
    return;
  }
  if (user.value.username === "" && user.value.password !== "") {
    message.error("請輸入帳號");
    return;
  }
  if (user.value.username !== "" && user.value.password === "") {
    message.error("請輸入密碼");
    return;
  }
  const _formData = new FormData();
  _formData.append("Username", user.value.username);
  _formData.append("Password", user.value.password);
  try {
    const res = (await apiAuth.post(
      "/api/GoogleSheet/login",
      _formData
    )) as AxiosResponse<any, any>;
    if (res.response !== undefined) {
      if (res.response.status === 401) {
        message.error("登入失敗");
        loginStatus.value = false;
      }
    } else {
      if (res.data.status === 200) {
        loginStatus.value = true;
        message.error("登入成功");
        router.push("/home");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * 以訪客名義
 */
const visitorSubmit = () => {
  loginStatus.value = false;
  router.push("/home");
};
</script>
