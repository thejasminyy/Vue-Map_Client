<template>
  <GoogleMap
    ref="mapRef"
    :styles="mapStyles"
    v-if="googleKey !== ''"
    :api-key="googleKey"
    :zoom="15"
    @click="openNewInfoWindow"
    @rightclick="openNewInfoWindow"
  >
    <MarkerCluster :options="{ algorithm: algorithm }">
      <div v-for="item in props.dataList" :key="item.id">
        <CustomMarker
          :options="{
            position: { lat: Number(item.lat), lng: Number(item.lng) },
          }"
          @click.stop="clickMarker(item)"
        >
          <div>
            <n-icon
              class="type0"
              :component="Mountain"
              size="35"
              v-if="item.type === '0'"
            />
            <n-icon
              class="type1"
              :component="Food24Filled"
              size="35"
              v-else-if="item.type === '1'"
            />
            <n-icon
              class="type2"
              :component="EventNoteTwotone"
              size="35"
              v-else-if="item.type === '2'"
            />
            <n-icon
              class="type3"
              :component="TagQuestionMark24Filled"
              size="35"
              v-else-if="item.type === '3'"
            />
          </div>
        </CustomMarker>
      </div>
    </MarkerCluster>
  </GoogleMap>
  <div class="loadingFailedWrap" v-else>
    <n-empty description="無 Google Map API Key 無法載入"> </n-empty>
  </div>
  <div id="infoWindow" v-show="false">
    <div class="infoWindowWrap">
      <div class="title">
        <div>
          <p>相簿名稱&nbsp;:&nbsp;</p>
          <p>{{ curInfoWindow.title }}</p>
        </div>
      </div>
      <div class="main">
        <div>
          <p>相簿說明&nbsp;:&nbsp;</p>
          <p>{{ curInfoWindow.depiction }}</p>
        </div>
        <div class="infoWindowBtnWrap">
          <button class="more">更多詳細</button>
        </div>
      </div>
    </div>
  </div>
  <div id="newInfoWindow" v-show="false">
    <div class="infoWindowWrap">
      <div class="title">
        <div>
          <p>X 軸&nbsp;:&nbsp;</p>
          <p>{{ mapCoordinate.lng }}</p>
        </div>
      </div>
      <div class="main">
        <div>
          <p>Y 軸&nbsp;:&nbsp;</p>
          <p>{{ mapCoordinate.lat }}</p>
        </div>
        <div class="infoWindowBtnWrap" v-if="loginStatus">
          <button class="newAlbum" v-show="props.switchDataBtn !== 'new'">
            建立相簿
          </button>
          <button class="getCoordinates" v-show="props.switchDataBtn === 'new'">
            取得座標
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  GoogleMap,
  CustomMarker,
  MarkerCluster,
  CustomControl,
  Marker,
  InfoWindow,
} from "vue3-google-map";
import { SuperClusterAlgorithm } from "@googlemaps/markerclusterer";
import { LatLngBoundsLiteral } from "@googlemaps/google-maps-services-js";
import { ref, onMounted, watch, type Ref, nextTick } from "vue";
import { apiAuth } from "@/plugins/axios";
import mapStyles from "./style.json"; // Google map style設定
import type { albumStruct } from "@/views/HomeView.vue";
import type { mapItemStruct } from "@/views/MapView.vue";
import { Mountain } from "@vicons/fa";
import { Food24Filled, TagQuestionMark24Filled } from "@vicons/fluent";
import { EventNoteTwotone } from "@vicons/material";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { getCoordinates } from "@/composables/googleMap/getCoordinates";

const userPinia = useUserStore();
const { loginStatus } = storeToRefs(userPinia);

/** google-map 相關 */
const mapRef = ref({} as any);
let mapInst: any = {};
let mapApi: any = {};

/** 傳入的 Data */
const props = defineProps<{
  dataList: albumStruct[];
  data: mapItemStruct;
  editAlbum: mapItemStruct;
  switchDataBtn: string;
}>();

/** 新建 newAlbum */
const newAlbum = ref(JSON.parse(JSON.stringify(props.data)) as mapItemStruct);
const emit = defineEmits<{
  // 更新狀態
  (e: "updataNewAlbum", data: mapItemStruct): void;
  (e: "updaSwitchBtn", type: string): void;
  (e: "updaNowMapItem", data: string): void;
}>();

/** 監聽更新父元件傳來的data */
watch(
  () => props.data,
  () => {
    newAlbum.value = JSON.parse(JSON.stringify(props.data)) as mapItemStruct;
  },
  { deep: true }
);

/** 監聽List更新 */
watch(
  props.dataList,
  () => {
    fitBounds();
  },
  { deep: true }
);

/** 監聽Google載入狀態 */
watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready) return;
    mapInst = mapRef?.value?.map;
    mapApi = mapRef?.value?.api;

    //地圖初始化完成
    mapApi.event.addListenerOnce(mapInst, "idle", () => {
      fitBounds();
      // console.log("map is ready");
      if (props.dataList.length > 0) {
        const idx = props.dataList.findIndex(
          (item: albumStruct) => item.id === props.editAlbum.item.id
        );
        if (idx !== -1) {
          //如果有找到資料 就打開視窗
          clickMarker(props.dataList[idx]);
        }
      }

      //監聽地圖事件
      {
        //地圖區塊載入完成
        mapInst.addListener("tilesloaded", () => {
          //console.log('map is loaded');
        });

        //地圖點擊
        mapInst.addListener("click", () => {
          closeInfoWindow();
        });
      }
    });
  }
);

/** Google map設定 */
const algorithm = new SuperClusterAlgorithm({
  radius: 30,
  maxZoom: 16,
  minPoints: 2,
});

onMounted(() => {
  getGoogleKey();
});

/** GoogleKey */
const googleKey: Ref<string> = ref("");
/** 取得GoogleKey */
const getGoogleKey = async () => {
  const storedUserName = sessionStorage.getItem("userName");
  try {
    const res = await apiAuth.get(
      `/api/GoogleSheet/GoogleKey?Username=${storedUserName}`
    );
    if (res.status === 200) {
      if (res.data.data.length > 0) {
        googleKey.value = res.data.data[0].key;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/** 相簿跳窗data */
const infoWindows: any = [];

/** 無資料跳窗data */
const newInfoWindows: any = [];

/** map 跳窗 X Y 位置 */
const mapCoordinate = ref({ lat: null, lng: null } as {
  lat: number | null;
  lng: number | null;
});

/**
 * 點擊地圖跳窗
 * @param event event
 */
const openNewInfoWindow = async (event: any) => {
  await nextTick();
  const latLng = event.latLng;
  const lat = latLng.lat(); //Y
  const lng = latLng.lng(); //X
  mapCoordinate.value.lat = lat;
  mapCoordinate.value.lng = lng;
  //要設timeout不然第一次可能讀不到
  setTimeout(() => {
    let infoWindow = new mapApi.InfoWindow({
      content: document.getElementById("newInfoWindow")?.innerHTML,
    });
    infoWindow.setPosition({ lat: lat, lng: lng });
    infoWindow.setOptions({
      pixelOffset: new mapApi.Size(0, -50),
    });

    //如果開啟多個先關掉前面的
    if (infoWindows.length > 0) closeInfoWindow();
    if (newInfoWindows.length > 0) closeNewInfoWindow();
    newInfoWindows.push(infoWindow);
    infoWindow.open(mapInst);
  }, 10);

  setTimeout(() => {
    //綁定地圖跳窗按鈕事件
    const coordinatesDiv: HTMLElement | null = document.querySelector(
      ".infoWindowWrap .getCoordinates"
    )!;
    coordinatesDiv?.addEventListener("click", function () {
      obtainCoordinates(event);
    });

    const switchNewDiv: HTMLElement | null = document.querySelector(
      ".infoWindowWrap .newAlbum"
    )!;
    switchNewDiv?.addEventListener("click", function () {
      emit("updaSwitchBtn", "new");
    });
  }, 50);
};

/** 關閉詳細跳窗 */
const closeInfoWindow = () => {
  const preInfoWindow = infoWindows.pop();
  preInfoWindow?.close();
};

/** 關閉點擊地圖跳窗 */
const closeNewInfoWindow = () => {
  const preInfoWindow = newInfoWindows.pop();
  preInfoWindow?.close();
};

/** 目前跳窗 data */
const curInfoWindow = ref({} as albumStruct);

/**
 * 點下圖標
 * @param item albumStruct data
 */
const clickMarker = async (item: albumStruct) => {
  curInfoWindow.value = item;
  await nextTick();
  //要設timeout不然第一次可能讀不到
  setTimeout(() => {
    let infoWindow = new mapApi.InfoWindow({
      content: document.getElementById("infoWindow")?.innerHTML,
    });
    infoWindow.setPosition({ lat: Number(item.lat), lng: Number(item.lng) });
    infoWindow.setOptions({
      pixelOffset: new mapApi.Size(0, -50),
    });

    //如果開啟多個先關掉前面的
    if (infoWindows.length > 0) closeInfoWindow();
    if (newInfoWindows.length > 0) closeNewInfoWindow();
    infoWindows.push(infoWindow);
    infoWindow.open(mapInst);
  }, 10);

  setTimeout(() => {
    //綁定地圖跳窗按鈕事件
    const btn: HTMLElement | null = document.querySelector(
      ".infoWindowWrap .more"
    )!;
    btn?.addEventListener("click", function () {
      //相簿更多詳細
      emit(
        "updaNowMapItem",
        `${curInfoWindow.value.type}_${curInfoWindow.value.id}`
      );
    });
  }, 10);
};

/** 台灣位置 */
const taiwanBounds = {
  north: 25.5, // 台灣最北緯度
  south: 21.5, // 台灣最南緯度
  west: 118, // 台灣最西經度
  east: 123, // 台灣最東經度
};

/** 移動至圖標 */
const fitBounds = (): vi => {
  setTimeout(() => {
    //所有圖標位置
    let bounds: google.maps.LatLngBounds | LatLngBoundsLiteral;
    if (props.dataList.length > 0) {
      //預設第一筆位置
      const firstItem = props.dataList[0];
      bounds = new mapApi.LatLngBounds(
        new mapApi.LatLng(Number(firstItem.lat), Number(firstItem.lng)),
        new mapApi.LatLng(Number(firstItem.lat), Number(firstItem.lng))
      );
      //如果albumList有資料 就把座標替換進去
      props.dataList.forEach((item: any) => {
        try {
          let latlng = { lat: Number(item.lat), lng: Number(item.lng) };
          bounds.extend(latlng);
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      //預設台灣位置
      if (mapApi) {
        bounds = new mapApi.LatLngBounds(
          new mapApi.LatLng(taiwanBounds.south, taiwanBounds.west),
          new mapApi.LatLng(taiwanBounds.north, taiwanBounds.east)
        );
      }
    }
    mapInst.fitBounds(bounds);
  }, 200);
};

/**
 * 取得座標
 * @param event event
 */
const obtainCoordinates = (event: any) => {
  //點擊事件，取得點擊位置的經緯度座標
  if (props.switchDataBtn === "new") {
    const { lng, lat } = getCoordinates(event);
    newAlbum.value.item.lng = String(lng);
    newAlbum.value.item.lat = String(lat);
    /** 更新至父元件 newAlbum */
    emit("updataNewAlbum", newAlbum.value);
  }
};

//設定為可被訪問的接口
defineExpose({ clickMarker, closeNewInfoWindow });
</script>
