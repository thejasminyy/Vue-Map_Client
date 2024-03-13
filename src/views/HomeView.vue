<template>
  <div class="homeWrap contentWrap">
    <div class="mainWrap">
      <!-- <div class="editBtnWrap" v-if="loginStatus">
        <n-icon :component="ImageEdit16Regular" size="16" />
        <button class="editCarousel">編輯</button>
      </div> -->
      <div class="timeLineWrap">
        <span
          :class="time.timeLineNowYear === 2020 ? 'invalidYearStyle' : ''"
          @click="changePhotosData(photosYear.reduce)"
        >
          <n-icon :component="ArrowLeft24Filled" size="25" />
        </span>
        <n-timeline item-placement="right" size="medium">
          <n-timeline-item :content="String(time.timeLineNowYear)">
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
              :content="item.depiction"
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
          <n-timeline-item :content="String(time.timeLineNowYear)">
            <template #icon>
              <n-icon>
                <CalendarTodayRound />
              </n-icon>
            </template>
          </n-timeline-item>
        </n-timeline>
        <span
          :class="
            time.timeLineNowYear === time.nowYear ? 'invalidYearStyle' : ''
          "
          @click="changePhotosData(photosYear.increase)"
        >
          <n-icon :component="ArrowRight24Filled" size="25" />
        </span>
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

import { ArrowRight24Filled, ArrowLeft24Filled } from "@vicons/fluent";
import { ref, onMounted } from "vue";
import { apiAuth, AxiosResponse } from "@/plugins/axios";
import { useMessage } from "naive-ui";

const message = useMessage();

const nowItme = ref(0);

/**
 * 時間線相關
 * @param nowTime 現在時間
 * @param nowYear 當前年份
 * @param timeLineNowYear 時間線的年份
 */
const time = ref({ nowTime: new Date(), nowYear: 0, timeLineNowYear: 0 } as {
  nowTime: Date;
  nowYear: number;
  timeLineNowYear: number | string;
});

onMounted(() => {
  time.value.nowYear = time.value.nowTime.getFullYear();
  time.value.timeLineNowYear = time.value.nowYear;
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
  _formData.append("Year", String(time.value.timeLineNowYear));

  try {
    const res = (await apiAuth.post(
      "/api/GoogleSheet/album",
      _formData
    )) as AxiosResponse<any, any>;
    photosList.value = [];
    if (res.status === 200) {
      photosList.value = res.data.data;
      console.log(res.data.data);
    }
  } catch (err) {
    console.log(err);
  }
};

/** 時間線左右按鈕定義 */
enum photosYear {
  reduce = -1,
  increase = 1,
}

/**
 * 切換時間線 左右按鈕
 * @param type 增加或是減少
 */
const changePhotosData = (type: number) => {
  time.value.timeLineNowYear = parseInt(
    time.value.timeLineNowYear as string,
    10
  ); // 轉換為數字
  if (type === photosYear.reduce) {
    time.value.timeLineNowYear -= 1;
    if (time.value.timeLineNowYear < 2020) {
      //如果點的年份超過當前年份 就return 防呆
      time.value.timeLineNowYear += 1;
      message.error("請勿選取低於2020年份");
      return;
    }
  } else if (type === photosYear.increase) {
    time.value.timeLineNowYear += 1;
    if (time.value.timeLineNowYear > time.value.nowYear) {
      //如果點的年份超過當前年份 就return 防呆
      time.value.timeLineNowYear -= 1;
      message.error("請勿超過當前年份");
      return;
    }
  }
  getPhotoData();
};
</script>
