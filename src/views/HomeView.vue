<template>
  <div class="homeWrap">
    <div class="mainWrap">
      <div class="editBtnWrap" v-if="loginStatus">
        <n-icon :component="ImageEdit16Regular" size="16" />
        <button class="editCarousel">編輯</button>
      </div>
      <n-carousel autoplay>
        <img
          class="carousel-img"
          src="img/1Njjl1n.jpg"
        />
        <img
          class="carousel-img"
          src="img/rxN49KX.jpg"
        />
        <img
          class="carousel-img"
          src="img/Z4p0e8C.jpg"
        />
      </n-carousel>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ImageEdit16Regular } from "@vicons/fluent";
import { useUserStore } from "@/stores/user";
const userPinia = useUserStore();
const { loginStatus } = storeToRefs(userPinia);
</script>
