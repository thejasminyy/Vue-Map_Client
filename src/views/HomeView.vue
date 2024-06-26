<template>
  <div class="homeWrap contentWrap">
    <div class="mainWrap">
      <div class="wrap">
        <div class="timeLineWrap">
          <div>
            <span
              :class="time.timeLineNowYear === 2020 ? 'invalidYearStyle' : ''"
              @click="changeAlbumsData(albumYear.reduce)"
            >
              <n-icon :component="ArrowLeft24Filled" size="25" />
            </span>
            <div class="timelineDataWrap">
              <n-timeline
                item-placement="right"
                size="medium"
                :horizontal="windowWidth >= 992 ? false : true"
              >
                <n-timeline-item :content="String(time.timeLineNowYear)">
                  <template #icon>
                    <n-icon>
                      <CalendarTodayRound />
                    </n-icon>
                  </template>
                </n-timeline-item>
                <template v-for="(item, index) in albumList" :key="index">
                  <n-timeline-item
                    class="active"
                    type="success"
                    :title="item.title"
                    :content="item.depiction"
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
            </div>

            <span
              :class="
                time.timeLineNowYear === time.nowYear ? 'invalidYearStyle' : ''
              "
              @click="changeAlbumsData(albumYear.increase)"
            >
              <n-icon :component="ArrowRight24Filled" size="25" />
            </span>
          </div>
        </div>
        <div class="carouselWrap">
          <!-- albumList.value[nowItme.value] -->
          <n-carousel
            autoplay
            v-if="
              albumList[nowItme] !== undefined && albumList[nowItme].imgs !== ''
            "
          >
            <template
              v-for="(img, index) in albumList[nowItme].imgs.split(',')"
              :key="index"
            >
              <img class="carousel-img" :src="img.trim()" />
            </template>
          </n-carousel>
          <div class="noDataWrap" v-else>
            <n-empty description="此年份無資料"> </n-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  CalendarTodayRound,
  RadioButtonUncheckedFilled,
  RadioButtonCheckedFilled,
} from "@vicons/material";

import { ArrowRight24Filled, ArrowLeft24Filled } from "@vicons/fluent";
import { ref, onMounted, type Ref } from "vue";
import { apiAuth } from "@/plugins/axios";
import { useMessage } from "naive-ui";

const message = useMessage();

/** 現在點到的相簿 */
const nowItme: Ref<number> = ref(0);

/** 螢幕寬度 */
const windowWidth: Ref<number> = ref(window.innerWidth);

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
  getAlbumData();
});

/**
 * 切換時間軸 item
 * @param num index
 */
const changeItem = (num: number) => {
  if (nowItme.value === num) return;
  nowItme.value = num;
};

/** 相簿資料 */
const albumList = ref([] as albumStruct[]);

/** 取得相簿 */
const getAlbumData = async () => {
  try {
    const res = await apiAuth.get(
      `/api/GoogleSheet/album?Year=${String(time.value.timeLineNowYear)}`
    );
    albumList.value = [];
    if (res.status === 200) {
      albumList.value = res.data.data;
      nowItme.value = 0; //預設第一筆
    }
  } catch (err) {
    console.log(err);
  }
};

/** 時間線左右按鈕定義 */
enum albumYear {
  reduce = -1,
  increase = 1,
}

/**
 * 切換時間線 左右按鈕
 * @param type 增加或是減少
 */
const changeAlbumsData = (type: number) => {
  time.value.timeLineNowYear = parseInt(
    time.value.timeLineNowYear as string,
    10
  ); // 轉換為數字
  if (type === albumYear.reduce) {
    time.value.timeLineNowYear -= 1;
    if (time.value.timeLineNowYear < 2020) {
      //如果點的年份超過當前年份 就return 防呆
      time.value.timeLineNowYear += 1;
      message.error("請勿選取低於2020年份");
      return;
    }
  } else if (type === albumYear.increase) {
    time.value.timeLineNowYear += 1;
    if (time.value.timeLineNowYear > time.value.nowYear) {
      //如果點的年份超過當前年份 就return 防呆
      time.value.timeLineNowYear -= 1;
      message.error("請勿超過當前年份");
      return;
    }
  }
  getAlbumData();
};

/** 監聽螢幕寬度改變 */
window.addEventListener("resize", () => {
  windowWidth.value = window.innerWidth;
});
/**
 * albums Item 定義
 * @property {string} id - id
 * @property {string} depiction - 相簿敘述
 * @property {string} imgs - 圖片
 * @property {number} lat - Y
 * @property {number} lng - X
 * @property {string} remark - 備註
 * @property {string} time - 建立時間
 * @property {string} title - 相簿名稱
 * @property {string} type - 類型
 */
export interface albumStruct {
  id: string;
  depiction: string;
  imgs: string;
  lat: string;
  lng: string;
  remark: string;
  time: string;
  title: string;
  type: string;
}
</script>
