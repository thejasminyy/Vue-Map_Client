<template>
  <div class="headerWrap">
    <div>
      <button type="button" @click="$router.push('/home')">Home</button>
      <button type="button" @click="$router.push('/about')">關於我</button>
      <button type="button" @click="$router.push('/map')">地圖</button>
      <n-icon
        title="登入"
        v-if="!loginStatus"
        :component="PeopleCircleOutline"
        size="24"
      />
      <n-icon title="登出" v-else :component="PeopleCircleOutline" size="24" />
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { PeopleCircleOutline } from "@vicons/ionicons5";
import { DoorArrowRight20Regular } from "@vicons/fluent";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
const userPinia = useUserStore();
const { loginStatus } = storeToRefs(userPinia);
const router = useRouter();
</script>
