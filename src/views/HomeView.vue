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
          <template v-for="(item, index) in data" :key="index">
            <n-timeline-item
              class="active"
              type="success"
              :title="item.title"
              :content="item.content"
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
              :content="item.content"
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

import { ref } from "vue";

// import { useUserStore } from "@/stores/user";
// const userPinia = useUserStore();
// const { loginStatus } = storeToRefs(userPinia);
const nowItme = ref(0);

/**
 * 切換item
 * @param num index
 */
const changeItem = (num: number) => {
  if (nowItme.value === num) return;
  nowItme.value = num;
};

const data = ref([
  {
    title: "登山",
    content: "玉山主峰",
    time: "2023-01-03 20:46",
  },
  {
    title: "登山",
    content: "奇萊主峰、北峰",
    time: "2023-03-27 13:50",
  },
  {
    title: "東京九日遊",
    content: "富士山",
    time: "2023-04-01",
  },
  {
    title: "志佳陽大山",
    content: "單攻",
    time: "2023-05-25",
  },
  {
    title: "小關山",
    content: "神池與小關山",
    time: "2023-08-25",
  },
  {
    title: "J的生日",
    content: "必須準備驚喜",
    time: "2023-09-21",
  },
  {
    title: "資深同事提出離職",
    content: "太令人傷心的事情",
    time: "2023-11-15",
  },
  {
    title: "J提出離職",
    content: "提出離職",
    time: "2023-11-15",
  },
]);
</script>
