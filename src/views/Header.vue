<template>
  <div class="headerWrap">
    <div>
      <button type="button">Home</button>
      <button type="button">關於我</button>
      <button type="button">地圖</button>
      <n-icon :component="PeopleCircleOutline" size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PeopleCircleOutline } from "@vicons/ionicons5";
</script>
