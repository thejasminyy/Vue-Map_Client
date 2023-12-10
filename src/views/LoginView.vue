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
            v-model:value="username"
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
            v-model:value="password"
            type="password"
            show-password-on="click"
            placeholder="Password"
            :maxlength="20"
            size="large"
            class="loginInputStyle"
            id="password"
            @keydown.enter="onSubmit()"
          >
            <template #prefix>
              <n-icon :component="LockOpen" />
            </template>
          </n-input>
        </div>
      </n-space>
      <div class="loginBtnWrap">
        <button>登入</button>
        <div class="visitorWrap">
          <div>
            <span><div></div></span>
            <p>或</p>
            <span><div></div></span>
          </div>
          <p>使用訪客登入</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { People, LockOpen } from '@vicons/ionicons5';
import { ref } from 'vue';
const username = ref('');
const password = ref('');

const onSubmit = () => {};
</script>
