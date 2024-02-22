<template>
  <div class="headerWrap">
    <div>
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
      <n-icon
        title="登入"
        v-if="!loginStatus"
        :component="PeopleCircleOutline"
        size="24"
      />
      <n-icon
        title="登出"
        v-else
        :component="DoorArrowRight20Regular"
        size="24"
        @click="signOut"
      />
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
const { loginStatus, userName } = storeToRefs(userPinia);
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
    loginStatus.value = true;
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
