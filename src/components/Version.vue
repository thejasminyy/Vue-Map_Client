<template>
  <p class="version">{{ version }}</p>
</template>
<script setup lang="ts">
import { ref } from "vue";
const version = ref(import.meta.env.VITE_VERSION);
</script>
