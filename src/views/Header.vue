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
      <n-icon
        title="登入詳細"
        :component="PeopleCircleOutline"
        size="24"
        @click="clickPILoginWindow"
      />
    </div>
    <div class="userDetailedWrap" v-if="PILoginWindow">
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
      <section class="signOutWrap">
        <button @click="signOut">
          登出
          <n-icon :component="DoorArrowRight20Regular" size="20" />
        </button>
      </section>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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
  //取得 session Storage
  const storedUserName = sessionStorage.getItem("userName");
  const storedLoginTime = sessionStorage.getItem("loginTime");
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
    loginTime.value = storedLoginTime;
  }
});

/** 登入詳細狀態 */
const PILoginWindow = ref(false);

/** 登入詳細事件 */
const clickPILoginWindow = () => {
  if (PILoginWindow.value) {
    PILoginWindow.value = false;
    //刪除監聽事件
    document.body.removeEventListener("click", clickEvent, false);
  } else {
    PILoginWindow.value = true;
    setTimeout(() => {
      //新增監聽事件
      document.body.addEventListener("click", clickEvent, false);
    }, 10);
  }
};

/** 點擊事件，點選框外就關閉 */
const clickEvent = (e: any) => {
  const profileBox: any = document.querySelector(".userDetailedWrap")!;
  if (!e.composedPath().includes(profileBox)) {
    PILoginWindow.value = false;
    document.body.removeEventListener("click", clickEvent, false);
  }
};

/** 登出 */
const signOut = () => {
  initLoginData();
  //跳轉到登入頁面
  message.success("登出");
  router.push("/");
};
</script>
