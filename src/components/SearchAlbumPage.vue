<template>
  <div class="selectDataWrap">
    <n-radio
      :checked="!props.showAlbumStatus"
      value="single"
      name="single"
      @change="emit('updateAlbumStatus', false)"
    >
      各別顯示
    </n-radio>
    <n-radio
      :checked="props.showAlbumStatus"
      value="all"
      name="all"
      @change="emit('updateAlbumStatus', true)"
    >
      顯示全部
    </n-radio>
  </div>
  <n-menu
    v-model:value="nowMapItem"
    :root-indent="36"
    :indent="12"
    :options="props.menuOptions"
    :expanded-keys="expandedKeys"
    @update:expanded-keys="updateKeys"
  />
</template>

<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/mixins/rwd";
@import "@/styles/mixins/scroll";
@import "@/styles/global";
@import "@/styles/pages/components/SearchAlbumPage";
</style>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from "vue";
import type { MenuOption } from "naive-ui";

const expandedKeys = ref<string[]>([]);

/** 傳入的 Data */
const props = defineProps<{
  showAlbumStatus: boolean;
  menuOptions: MenuOption[];
  data: string;
}>();

/** 查詢 目前點到菜單type */
const nowMapItem: Ref<string> = ref(props.data);

watch(
  () => props.data,
  () => {
    nowMapItem.value = props.data;
  },
  { deep: true }
);

watch(nowMapItem, () => {
  updateExpandedKeys();
  emit("updateNowMapItem", nowMapItem.value);
});

onMounted(() => {
  updateExpandedKeys();
});

/** 判斷 menu 要開啟哪個子選單 */
const updateExpandedKeys = () => {
  if (
    !nowMapItem.value.includes("other") &&
    !nowMapItem.value.includes("all")
  ) {
    const keyPrefix = nowMapItem.value.split("_")[0];
    const keysToAdd = [`${keyPrefix}_all`, `${keyPrefix}_all_other`];
    keysToAdd.forEach((key) => {
      if (!expandedKeys.value.includes(key)) {
        expandedKeys.value.push(key);
      }
    });
  } else if (nowMapItem.value.includes("all")) {
    const keyPrefix = nowMapItem.value.split("_")[0];
    const keysToAdd = [`${keyPrefix}_all`];
    keysToAdd.forEach((key) => {
      if (!expandedKeys.value.includes(key)) {
        expandedKeys.value.push(key);
      }
    });
  }
};

/**
 * 點擊 menu 更新 expandedKeys
 * @param keys 子選單keys
 */
const updateKeys = (keys: string[]) => {
  expandedKeys.value = keys;
};

const emit = defineEmits<{
  // 更新狀態
  (e: "updateAlbumStatus", status: boolean): void;
  (e: "updateNowMapItem", data: string): void;
}>();
</script>
