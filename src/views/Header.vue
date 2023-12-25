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
      />
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { PeopleCircleOutline } from "@vicons/ionicons5";
import { DoorArrowRight20Regular } from "@vicons/fluent";
import { useUserStore } from "@/stores/user";
const userPinia = useUserStore();
const { loginStatus } = storeToRefs(userPinia);
</script>
