<template>
  <div class="headerWrap">
    <div class="menuWrap">
      <button
        type="button"
        :class="$router.currentRoute.value.name == 'Home' ? 'active' : ''"
        @click="$router.push('/home')"
      >
        Home
      </button>
      <button
        type="button"
        :class="$router.currentRoute.value.name == 'About' ? 'active' : ''"
        @click="$router.push('/about')"
      >
        About Me
      </button>
      <button
        type="button"
        :class="$router.currentRoute.value.name == 'Map' ? 'active' : ''"
        @click="$router.push('/map')"
      >
        Map
      </button>
      <n-icon title="詳細" :component="PeopleCircleOutline" size="24" />
    </div>
    <div class="userDetailedWrap">
      <section class="avatarWrap">
        <span></span>
        <div>
          <p>{{ userName !== undefined ? userName.charAt(0) : "--" }}</p>
        </div>
        <span></span>
      </section>
      <section class="userMainWrap">
        <div class="userName">
          <p>{{ userName }}</p>
        </div>
        <p>登入時間</p>
        <p>{{ loginTime }}</p>
      </section>
      <section class="signOutWrap" @click="signOut">
        <button>
          登出
          <n-icon :component="DoorArrowRight20Regular" size="20" />
        </button>
      </section>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { PeopleCircleOutline } from "@vicons/ionicons5";
import { DoorArrowRight20Regular } from "@vicons/fluent";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";

const userPinia = useUserStore();
const { loginStatus, loginTime, userName } = storeToRefs(userPinia);
const { initLoginData } = useUserStore();
const router = useRouter();
const message = useMessage();

onMounted(() => {
  const storedUserName = sessionStorage.getItem("userName");
  if (
    storedUserName !== "" &&
    storedUserName !== null &&
    storedUserName !== undefined
  ) {
    if (storedUserName !== "訪客") {
      loginStatus.value = true;
    } else {
      loginStatus.value = false;
    }

    userName.value = storedUserName;
  }
});

/**登出 */
const signOut = () => {
  initLoginData();
  //跳轉到登入頁面
  message.success("登出帳號");
  router.push("/");
};
</script>
