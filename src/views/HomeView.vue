<template>
  <div class="homeWrap contentWrap">
    <div class="mainWrap">
      <!-- <div class="editBtnWrap" v-if="loginStatus">
        <n-icon :component="ImageEdit16Regular" size="16" />
        <button class="editCarousel">編輯</button>
      </div> -->
      <div class="timeLineWrap">
        <n-timeline item-placement="right" size="medium">
          <n-timeline-item content="2023">
            <template #icon>
              <n-icon>
                <CalendarTodayRound />
              </n-icon>
            </template>
          </n-timeline-item>
          <template v-for="(item, index) in photosList" :key="index">
            <n-timeline-item
              class="active"
              type="success"
              :title="item.title"
              :content="item.remark"
              :time="item.time"
              @click="changeItem(index)"
              v-if="index === nowItme"
            >
              <template #icon>
                <n-icon>
                  <RadioButtonCheckedFilled />
                </n-icon>
              </template>
            </n-timeline-item>
            <n-timeline-item
              :title="item.title"
              :content="item.remark"
              :time="item.time"
              @click="changeItem(index)"
              v-else
            >
              <template #icon>
                <n-icon>
                  <RadioButtonUncheckedFilled />
                </n-icon>
              </template>
            </n-timeline-item>
          </template>
          <n-timeline-item content="2023">
            <template #icon>
              <n-icon>
                <CalendarTodayRound />
              </n-icon>
            </template>
          </n-timeline-item>
        </n-timeline>
      </div>
      <div class="carouselWrap">
        <n-carousel autoplay>
          <img class="carousel-img" src="/img/1Njjl1n.jpg" />
          <img class="carousel-img" src="/img/rxN49KX.jpg" />
          <img class="carousel-img" src="/img/Z4p0e8C.jpg" />
        </n-carousel>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// import { storeToRefs } from "pinia";
// import { ImageEdit16Regular } from "@vicons/fluent";
import {
  CalendarTodayRound,
  RadioButtonUncheckedFilled,
  RadioButtonCheckedFilled,
} from "@vicons/material";

import { ref, onMounted } from "vue";
import { apiAuth, AxiosResponse } from "@/plugins/axios";

// import { useUserStore } from "@/stores/user";
// const userPinia = useUserStore();
// const { loginStatus } = storeToRefs(userPinia);
const nowYear = ref(2023);
const nowItme = ref(0);

onMounted(() => {
  getPhotoData();
});

/**
 * 切換時間軸 item
 * @param num index
 */
const changeItem = (num: number) => {
  if (nowItme.value === num) return;
  nowItme.value = num;
};

const photosList = ref([] as any[]);

/** 取得相簿 */
const getPhotoData = async () => {
  const _formData = new FormData();
  _formData.append("Year", nowYear.value.toString());

  try {
    const res = (await apiAuth.post(
      "/api/GoogleSheet/photos",
      _formData
    )) as AxiosResponse<any, any>;
    photosList.value = [];
    if (res.status === 200) {
      photosList.value = res.data.data;
    }
  } catch (err) {
    console.log(err);
  }
};
</script>
