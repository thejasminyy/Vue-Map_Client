<template>
  <div class="mapWrap contentWrap">
    <div class="googleMapWrap">
      <GoogleMap
        ref="mapRef"
        :styles="hideStyle"
        v-if="googleKey !== ''"
        :api-key="googleKey"
        :zoom="15"
        @click="openNewInfoWindow"
        @rightclick="openNewInfoWindow"
      >
        <MarkerCluster :options="{ algorithm: algorithm }">
          <div v-for="item in albumList" :key="item.id">
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
        <span>無 Google Map API Key 無法載入</span>
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
              <button class="newAlbum" v-show="switchDataBtn !== 'new'">
                建立相簿
              </button>
              <button class="getCoordinates" v-show="switchDataBtn === 'new'">
                取得座標
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="dataInfoWrap">
        <div :class="['dataMainWrap', loginStatus ? 'loginStatus' : '']">
          <p>{{ mapTitleTex }}</p>
          <div class="infoWrap">
            <div>
              <p>相簿名稱</p>
              <n-input
                v-if="editAlbum.status"
                type="text"
                v-model:value="editAlbum.item.title"
                placeholder="請輸入內容"
              />
              <p v-else>{{ editAlbum.item.title }}</p>
            </div>
            <div>
              <p>建立時間</p>
              <p>{{ editAlbum.item.time }}</p>
            </div>
            <div class="locationWrap">
              <p>地點</p>
              <div>
                <div>
                  <p>X 軸</p>
                  <p>{{ editAlbum.item.lng }}</p>
                </div>
                <div>
                  <p>Y 軸</p>
                  <p>{{ editAlbum.item.lat }}</p>
                </div>
              </div>
            </div>
            <div>
              <p>類型</p>
              <n-space vertical v-if="editAlbum.status">
                <n-select
                  v-model:value="editAlbum.item.type"
                  :options="typeOptions"
                  placeholder="請選擇類型"
                />
              </n-space>
              <p v-else>{{ typeLabel }}</p>
            </div>
            <div>
              <p>相簿說明</p>
              <n-input
                class="textareaStyle"
                v-if="editAlbum.status"
                type="textarea"
                v-model:value="editAlbum.item.depiction"
                placeholder="請輸入內容"
              />
              <p v-else>{{ editAlbum.item.depiction }}</p>
            </div>
            <div>
              <p>備註</p>
              <n-input
                class="textareaStyle"
                v-if="editAlbum.status"
                type="textarea"
                v-model:value="editAlbum.item.remark"
                placeholder="請輸入內容"
              />
              <p v-else>{{ editAlbum.item.remark }}</p>
            </div>
          </div>
          <div class="imgWrap">
            <n-spin size="medium" :show="editAlbum.uploadStatus">
              <template v-for="(item, index) in editAlbum.imgsSrc" :key="item">
                <div v-if="item !== ''" class="imgsSrcWrap">
                  <div
                    class="deleteIconWrap"
                    @click="deleteImage('edit', editAlbum.imgsSrc, index)"
                    v-if="editAlbum.status"
                  >
                    <n-icon :component="Add20Filled" size="18" />
                  </div>
                  <n-image :src="item" />
                </div>
              </template>
              <div class="uploadImgWrap" v-if="editAlbum.status">
                <label enctype="multipart/form-data">
                  <n-icon :component="Add20Filled" size="25" />
                  <input
                    type="file"
                    max="1"
                    id="edit_img_uploader"
                    accept="image/*"
                    @change="
                      uploadImgs(
                        $event,
                        'edit_img_uploader',
                        editAlbum.imgsSrc,
                        editAlbum.uploadNum,
                        'edit'
                      )
                    "
                  />
                </label>
              </div>
            </n-spin>
          </div>
        </div>
        <div class="dataBtnWrap" v-if="loginStatus">
          <button class="delete" @click="deletetData(editAlbum.item.id)">
            刪除
          </button>
          <button
            class="edit"
            v-if="!editAlbum.status && switchDataBtn !== 'new'"
            @click="editData"
          >
            編輯
          </button>
          <button class="cancel" v-if="editAlbum.status" @click="cancelEdit">
            取消
          </button>
          <button class="save" v-if="editAlbum.status" @click="sendEditData">
            儲存
          </button>
        </div>
      </div>
    </div>
    <div class="mapDataWrap">
      <div class="titileWrap">
        <button
          :class="switchDataBtn === 'search' ? 'active' : ''"
          @click="switchBtn('search')"
        >
          查詢
        </button>
        <button
          v-if="loginStatus"
          :class="switchDataBtn === 'search' ? '' : 'active'"
          @click="switchBtn('new')"
        >
          建立
        </button>
      </div>
      <div class="mainWrap">
        <section class="searchDataWrap" v-if="switchDataBtn === 'search'">
          <n-menu
            v-model:value="nowMapItem"
            :root-indent="36"
            :indent="12"
            :options="menuOptions"
          />
        </section>
        <section class="newDataWrap" v-else>
          <newAlbumPage
            :options="typeOptions"
            :data="newAlbum"
            @deleteImage="deleteImage"
            @initNewAlbum="initNewAlbum"
            @updataNewAlbum="updataNewAlbum"
            @addedSuccess="initData"
            @uploadImages="uploadImgs"
          ></newAlbumPage>
        </section>
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
import {
  ref,
  onMounted,
  watch,
  h,
  Component,
  type Ref,
  computed,
  nextTick,
} from "vue";
import {
  Add20Filled,
  Food24Filled,
  TagQuestionMark24Filled,
} from "@vicons/fluent";
import { Mountain } from "@vicons/fa";
import { EventNoteTwotone } from "@vicons/material";
import moment from "moment";
import { useMessage, useDialog, NIcon } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { apiAuth, AxiosResponse } from "@/plugins/axios";
import type { albumStruct } from "@/views/HomeView.vue";
import newAlbumPage from "@/components/NewAlbumPage.vue";
import { deepCompare } from "@/composables/deepCompare";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const userPinia = useUserStore();
const { loginStatus } = storeToRefs(userPinia);
const message = useMessage();
const dialog = useDialog();

const mapRef = ref({} as any);
let mapInst: any = {};
let mapApi: any = {};

/**
 * 自訂義icon
 * @param icon - icon name
 */
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
/** Google map設定 */
const algorithm = new SuperClusterAlgorithm({
  radius: 30,
  maxZoom: 16,
  minPoints: 2,
});

/** Google map style設定 */
const hideStyle = ref([
  {
    featureType: "poi.business",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
]);

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
      //console.log('map is ready');

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

const infoWindows: any = [];
const newInfoWindows: any = [];

/** 移動至圖標 */
const fitBounds = () => {
  setTimeout(() => {
    //涵蓋所有圖標位置
    let bounds = new mapApi.LatLngBounds();
    albumList.value.forEach((item: any) => {
      try {
        let latlng = { lat: Number(item.lat), lng: Number(item.lng) };
        bounds.extend(latlng);
      } catch (error) {
        console.log(error);
      }
    });
    mapInst.fitBounds(bounds);
  }, 200);
};

/** 目前跳窗 data */
const curInfoWindow = ref({} as albumStruct);

/** 點下圖標 */
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
      nowMapItem.value = `${curInfoWindow.value.type}_${curInfoWindow.value.id}`;
    });
  }, 10);
};

const mapCoordinate = ref({ lat: null, lng: null } as {
  lat: number | null;
  lng: number | null;
});

/** 點擊地圖跳窗 */
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
      getCoordinates(event);
    });

    const switchNewDiv: HTMLElement | null = document.querySelector(
      ".infoWindowWrap .newAlbum"
    )!;
    switchNewDiv?.addEventListener("click", function () {
      switchBtn("new");
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

/** 更多詳細 title */
const mapTitleTex: Ref<string> = ref("最新一筆");

/** 類型 下拉選單內容 */
const typeOptions: Ref<typeStruct[]> = ref([
  {
    label: "請選擇類型",
    value: "",
    disabled: true,
  },
  {
    label: "登山",
    value: "0",
  },
  {
    label: "美食",
    value: "1",
  },
  {
    label: "事件",
    value: "2",
  },
  {
    label: "其他",
    value: "3",
  },
]);

/** 查詢 選單內容設定 */
const menuOptions: Ref<MenuOption[]> = ref([
  {
    label: "登山",
    key: "0_all",
    icon: renderIcon(Mountain),
    disabled: true,
    children: [],
  },
  {
    label: "美食",
    key: "1_all",
    icon: renderIcon(Food24Filled),
    disabled: true,
    children: [],
  },
  {
    label: "事件",
    key: "2_all",
    icon: renderIcon(EventNoteTwotone),
    disabled: true,
    children: [],
  },
  {
    label: "其他",
    key: "3_all",
    icon: renderIcon(TagQuestionMark24Filled),
    disabled: true,
    children: [],
  },
]);

/**
 * 相簿單筆 建立
 * @param item - data
 * @param imgsSrc - [] img src
 * @param uploadNum - 上傳到第幾個圖片 src
 * @param uploadStatus - 上傳圖片時的loading狀態
 */
const newAlbum = ref({
  item: {
    newDate: "",
    locationStaus: "map",
    title: "",
    depiction: "",
    remark: "",
    lat: "請輸入內容",
    lng: "請輸入內容",
    type: "",
    imgs: "",
  } as mapItemStruct,
  imgsSrc: [] as string[],
  uploadNum: 0,
  uploadStatus: false,
} as newAlbumStruct);

/** 相簿資料 */
const albumList = ref([] as albumStruct[]);

/**
 * 相簿單筆 編輯
 * @param item - data
 * @param status - 相簿編輯狀態
 * @param imgsSrc - []
 * @param uploadNum - 上傳到第幾個圖片 src
 * @param uploadStatus - 上傳圖片時的loading狀態
 */
const editAlbum = ref({
  item: {} as albumStruct,
  status: false,
  imgsSrc: [] as string[],
  uploadNum: 0,
  uploadStatus: false,
});

onMounted(() => {
  getAlbumData();
  getGoogleKey();
});

/** 取得相簿 */
const getAlbumData = async () => {
  try {
    const res = await apiAuth.get(`/api/GoogleSheet/album?Year=`); //取全部 不帶參數
    albumList.value = [];
    if (res.status === 200) {
      albumList.value = res.data.data;
      if (nowMapItem.value === "") {
        //如果沒有菜單 type 就預設最新一筆資料
        const newData = getAlbumItem(
          "all",
          albumList.value[albumList.value.length - 1].type
        );
        handleSwitchData(newData, "");
      }
      //查詢菜單清空
      menuOptions.value.forEach((menuOption) => {
        menuOption.children = [];
        menuOption.disabled = true;
      });

      albumList.value.forEach((album) => {
        // 使用type來找menuOptions
        const menuOptionsFiltered = menuOptions.value.filter(
          (option) => option.key === `${album.type}_all`
        );
        menuOptionsFiltered.forEach((menuOption) => {
          if (menuOption.children !== undefined) {
            if (menuOption.children.length === 0) {
              menuOption.children.push({
                label: "顯示全部",
                key: menuOption.key,
              });
              menuOption.children.push({
                // type: "group",
                label: "各別顯示", // title
                key: `${menuOption.key}_other`,
                children: [], // 初始化子选项数组
              });
              //如果無資料 會把disabled打開
              menuOption.disabled = true;
            } else {
              //如果有資料 會把disabled關閉
              menuOption.disabled = false;
            }

            // 把子data放入各別顯示的children中
            const eachDisplayOption = menuOption.children.find(
              (option) => option.label === "各別顯示"
            );
            if (eachDisplayOption) {
              if (
                eachDisplayOption.children !== undefined &&
                Array.isArray(eachDisplayOption.children)
              ) {
                eachDisplayOption.children.push({
                  label: album.title, // title
                  key: `${album.type}_${album.id}`, // id
                });
              }
            }
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/** 目前按鈕是哪一個 new or search */
const switchDataBtn: Ref<string> = ref("search");
/**
 * 切換按鈕 查詢 or 建立
 * @param type search || new
 */
const switchBtn = (type: string) => {
  const switchNewDiv: HTMLElement | null = document.querySelector(
    ".infoWindowWrap .newAlbum"
  )!;
  const coordinatesDiv: HTMLElement | null = document.querySelector(
    ".infoWindowWrap .getCoordinates"
  )!;
  if (type === "search") {
    const { title, depiction, remark, lat, lng, type, imgs } =
      newAlbum.value.item;
    //判斷有沒有輸入資料
    if (
      title !== "" ||
      depiction !== "" ||
      remark ||
      lat !== "請輸入內容" ||
      lng !== "請輸入內容" ||
      type !== "" ||
      imgs !== ""
    ) {
      dialog.warning({
        title: "警告",
        content: "不儲存送出離開 ?",
        positiveText: "確定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: () => {
          switchDataBtn.value = "search";
          initNewAlbum();
          switchNewDiv.style.display = "block";
          coordinatesDiv.style.display = "none";
        },
      });
    } else {
      switchDataBtn.value = "search";
      switchNewDiv.style.display = "block";
      coordinatesDiv.style.display = "none";
    }
  } else {
    if (editAlbum.value.status) {
      dialog.warning({
        title: "警告",
        content: "正在編輯中，請問要取消編輯，改為建立資料嗎 ? ",
        positiveText: "確定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: () => {
          editAlbum.value.status = false;
          switchDataBtn.value = "new";
          //切到建立 取得現在時間並轉換成字串格式
          newAlbum.value.item.newDate = moment().format("YYYY-MM-DD HH:mm:ss");
          message.success("取消編輯");
        },
      });
    } else {
      switchDataBtn.value = "new";
      //切到建立 取得現在時間並轉換成字串格式
      newAlbum.value.item.newDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }
    switchNewDiv.style.display = "none";
    coordinatesDiv.style.display = "block";
  }
};

/** 查詢 目前點到菜單type */
const nowMapItem: Ref<string> = ref("");

/** 查詢 監聽菜單type 切換 */
watch(nowMapItem, (newValue, oldValue) => {
  /** 修改obj狀態 */
  let editObjStatus = true;

  /** 相簿單筆資料 預設undefined */
  let newData: albumStruct | undefined = undefined;
  /** 相簿上筆單筆資料 預設undefined */
  let oidData: albumStruct | undefined = undefined;
  /** nowMapItem.value */
  const mapItem = nowMapItem.value;

  //判斷現在點到顯示全部或是顯示單筆 空值就忽略
  if (mapItem.includes("all")) {
    //如果點到all 就把type篩選出來
    newData = getAlbumItem("all", mapItem.split("_all")[0]);
    // console.log(mapItem.split("_all")[0]);
  } else if (mapItem !== "") {
    //如果點到各別顯示 就把type篩選出來
    newData = getAlbumItem("", mapItem.split("_")[0], mapItem.split("_")[1]);
  }

  //判斷editAlbum需要跟上一個data做比對
  if (oldValue === undefined || oldValue === "") {
    oidData = getAlbumItem(
      "",
      editAlbum.value.item.type,
      editAlbum.value.item.id
    );
  } else if (oldValue.includes("all")) {
    oidData = getAlbumItem("all", oldValue.split("_all")[0]);
  } else {
    oidData = getAlbumItem("", oldValue.split("_")[0], oldValue.split("_")[1]);
  }
  //判斷現在是否是編輯
  if (editAlbum.value.status) {
    //編輯資料與切換後的obj是否一樣
    editObjStatus = deepCompare(editAlbum.value.item, oidData);
  }
  if (!editObjStatus) {
    //如果obj資料不相同
    dialog.warning({
      title: "警告",
      content: "不儲存編輯離開 ?",
      positiveText: "確定",
      negativeText: "取消",
      maskClosable: false,
      onPositiveClick: () => {
        //確定
        editAlbum.value.status = false;
        handleSwitchData(newData, mapItem);
        message.success("取消編輯");
      },
    });
  } else {
    //如果obj資料相同
    if (editAlbum.value.status) {
      message.success("取消編輯");
    }
    editAlbum.value.status = false;
    handleSwitchData(newData, mapItem);
  }
});

/**
 * 替換 editAlbum data
 * @param newData 新 data
 * @param mapItem 菜單 type
 */
const handleSwitchData = (
  newData: albumStruct | undefined,
  mapItem: string
) => {
  if (newData !== undefined) {
    editAlbum.value.item = JSON.parse(JSON.stringify(newData)); //複製資料到editAlbum
    const imgsArray = editAlbum.value.item.imgs.split(",");
    editAlbum.value.imgsSrc = [];
    editAlbum.value.imgsSrc = imgsArray;
    editAlbum.value.uploadNum = imgsArray.length;

    if (mapItem === "") mapTitleTex.value = "最新一筆";
    else
      mapTitleTex.value = `${typeLabel.value} - ${
        mapItem.includes("all") ? "最新一筆" : "各別顯示"
      }`;
  } else {
    message.warning("無資料");
    editAlbum.value.item = {} as albumStruct;
  }
};

/**
 * 取得相簿單筆資料
 * @param sortType 菜單 點all或是單筆空值
 * @param itemType 菜單 單筆資料的type
 * @param id sortType不是all 就需要帶id
 * @returns undefined or data
 */
const getAlbumItem = (
  sortType: string,
  itemType: string,
  id?: string
): undefined | albumStruct => {
  if (sortType === "all") {
    const newData = albumList.value.filter(
      (item: albumStruct) => item.type === itemType
    );
    if (newData.length > 0) {
      return newData[newData.length - 1];
    } else {
      return undefined;
    }
  } else {
    const newData = albumList.value.filter(
      (item: albumStruct) => item.id === id
    );
    if (newData.length > 0) {
      return newData[0];
    } else {
      return undefined;
    }
  }
};

/**
 * 取得座標
 * @param event event
 */
const getCoordinates = (event: any) => {
  //右鍵點擊事件，取得點擊位置的經緯度座標
  const latLng = event.latLng;
  const lat = latLng.lat(); //Y
  const lng = latLng.lng(); //X
  if (switchDataBtn.value === "new") {
    console.log(newAlbum.value.item);
    newAlbum.value.item.lng = String(lng);
    newAlbum.value.item.lat = String(lat);
  }
};

/**
 * 上傳圖片轉換成 base64
 * @param e event
 * @param id id
 * @param storePhotesPlace data
 * @param imgIndex 存入data位置
 * @param type 建立 or 修改
 */
const uploadImgs = (
  e: any,
  id: string,
  storePhotesPlace: string[],
  imgIndex: number,
  type: string
) => {
  const imgUploader: HTMLInputElement = document.querySelector(`#${id}`)!;
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = async function (event) {
    editRefData(type, "status");
    let result = "";
    storePhotesPlace[imgIndex] = "";
    if (event.target!.result!.toString().length / 1024 > 500) {
      compressBase64Image(
        event.target!.result!.toString(),
        500,
        async function (compressedBase64: string) {
          result = compressedBase64;
          storePhotesPlace[imgIndex] = await uploadImage(result, type); // 更新 storePhotesPlace
          editRefData(type, "increase");
        }
      );
    } else {
      result = event.target!.result!.toString();
      storePhotesPlace[imgIndex] = await uploadImage(result, type); // 更新 storePhotesPlace
      editRefData(type, "increase");
    }
    imgUploader.value = "";
  };
};

/**
 * 壓縮 base64 圖片
 * @param base64 base64
 * @param maxSize 壓縮後的圖片最大大小
 * @param callback 壓縮完成後回傳，將壓縮後的 base64 圖片作為參數
 */
const compressBase64Image = (
  base64: string,
  maxSize: number,
  callback: (base64: string) => void
) => {
  let img = new Image();
  img.src = base64;
  img.onload = function () {
    let canvas = document.createElement("canvas");
    let ctx: any = canvas.getContext("2d");
    let width = img.width;
    let height = img.height;
    let scale = 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    // drawImage(放 img 元素他會取裡面的 src, 距離左邊 px, 距離上方 px, 要畫的寬度, 要畫的高度)
    ctx.drawImage(img, 0, 0, width * scale, height * scale);
    let compressedBase64 = canvas.toDataURL("image/png", 0.9);
    let i = 1;
    while (compressedBase64.length > maxSize * 1024) {
      i++;
      scale *= 0.9;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx!.drawImage(img, 0, 0, width * scale, height * scale);
      compressedBase64 = canvas.toDataURL("image/png", 0.9);
    }
    callback(compressedBase64);
  };
};

/**
 * 上傳圖片
 * @param base64 base64
 * @param type 建立 or 修改
 */
const uploadImage = async (base64: string, type: string) => {
  const formData = new FormData();
  formData.append("base64string", base64);
  try {
    const res = await apiAuth.post("/api/Imgur", formData);
    editRefData(type, "status");
    return res.data.split(".jpeg")[0];
  } catch (err) {
    editRefData(type, "status");
    message.error("上傳失敗");
    console.log(err);
  }
};

/**
 * 修改ref data
 * @param type 建立 or 修改
 * @param content 狀態(uploadStatus)或是index
 */
const editRefData = (type: string, content: string) => {
  if (type === "new") {
    if (content === "status") {
      if (newAlbum.value.uploadStatus) newAlbum.value.uploadStatus = false;
      else newAlbum.value.uploadStatus = true;
    } else if (content === "increase") {
      newAlbum.value.uploadNum += 1;
    } else {
      newAlbum.value.uploadNum -= 1;
    }
  } else {
    if (content === "status") {
      if (editAlbum.value.uploadStatus) editAlbum.value.uploadStatus = false;
      else editAlbum.value.uploadStatus = true;
    } else if (content === "increase") {
      editAlbum.value.uploadNum += 1;
    } else {
      editAlbum.value.uploadNum + -1;
    }
  }
};

/**
 * 刪除 已上傳完的圖片
 * @param data imgSrc
 * @param imgIndex 位置 index
 */
const deleteImage = (type: string, data: string[], imgIndex: number) => {
  data.splice(imgIndex, 1); //刪除Src
  editRefData(type, "decrease");
};

/** 取消編輯資料 */
const cancelEdit = () => {
  dialog.warning({
    title: "警告",
    content: "取消編輯 ? ",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: () => {
      editAlbum.value.status = false;
      /** 相簿單筆資料 預設undefined */
      let newData: albumStruct | undefined = undefined;
      if (nowMapItem.value.includes("all")) {
        newData = getAlbumItem("all", editAlbum.value.item.type);
      } else {
        newData = getAlbumItem(
          "",
          editAlbum.value.item.type,
          editAlbum.value.item.id
        );
      }
      handleSwitchData(newData, nowMapItem.value); //取得資料
      message.success("取消編輯");
    },
  });
};

/** 編輯資料 */
const editData = () => {
  editAlbum.value.status = true;
};

/** 送出編輯資料 */
const sendEditData = async () => {
  //把img取出
  editAlbum.value.item.imgs = editAlbum.value.imgsSrc
    .filter((item) => item !== "")
    .map((item) => item)
    .join(",");

  if (editAlbum.value.item.title === "") {
    message.warning("請輸入相簿名稱");
    return;
  }
  if (editAlbum.value.item.type === "") {
    message.warning("請選擇類型");
    return;
  }
  if (editAlbum.value.item.depiction === "") {
    message.warning("請輸入相簿敘述");
    return;
  }
  if (editAlbum.value.item.remark === "") {
    message.warning("請輸入備註");
    return;
  }
  if (editAlbum.value.item.imgs.length === 0) {
    message.warning("請上傳照片");
    return;
  }
  if (editAlbum.value.item.lat === "" || editAlbum.value.item.lng === "") {
    message.warning("請選擇地點");
    return;
  }
  const _formData = new FormData();
  _formData.append("Id", String(editAlbum.value.item.id));
  _formData.append("Name", editAlbum.value.item.title);
  _formData.append("Time", String(editAlbum.value.item.time));
  _formData.append("Lat", String(editAlbum.value.item.lat));
  _formData.append("Lng", String(editAlbum.value.item.lng));
  _formData.append("Type", String(editAlbum.value.item.type));
  _formData.append("Depiction", editAlbum.value.item.depiction);
  _formData.append("Remark", editAlbum.value.item.remark);
  _formData.append("Imgs", String(editAlbum.value.item.imgs));
  try {
    const res = (await apiAuth.put(
      "/api/GoogleSheet/album",
      _formData
    )) as AxiosResponse<any, any>;
    if (res.status === 200) {
      message.success("修改成功");
      editAlbum.value.status = false;
      await getAlbumData();
      nowMapItem.value = `${editAlbum.value.item.type}_${editAlbum.value.item.id}`;
    }
  } catch (err) {
    console.log(err);
    message.error("修改失敗");
  }
};

/**
 * 刪除資料
 * @param albumId id
 */
const deletetData = (albumId: string) => {
  dialog.warning({
    title: "警告",
    content: "請問刪除此相簿嗎 ? ",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: async () => {
      try {
        const res = await apiAuth.delete(
          `/api/GoogleSheet/album?albumId=${albumId}`
        );
        if (res.status === 200) {
          message.success("刪除成功");
          if (editAlbum.value.status) {
            editAlbum.value.status = false;
          }
          getAlbumData();
        }
      } catch (err) {
        console.log(err);
        message.error("刪除失敗");
      }
    },
  });
};

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

/** 類型換取文字 */
const typeLabel = computed(() => {
  const selectedOption = typeOptions.value.find(
    (option) => option.value === editAlbum.value.item.type
  );
  return selectedOption ? selectedOption.label : editAlbum.value.item.type;
});

/** 重置相簿資料 */
const initNewAlbum = () => {
  newAlbum.value.item = {
    newDate: moment().format("YYYY-MM-DD HH:mm:ss"),
    locationStaus: "map",
    title: "",
    depiction: "",
    remark: "",
    lat: "請輸入內容",
    lng: "請輸入內容",
    type: "",
    imgs: "",
  };
  newAlbum.value.imgsSrc = [];
  newAlbum.value.uploadNum = 0;
};

/** 子元件傳入更新相簿資料 */
const updataNewAlbum = (data: newAlbumStruct) => {
  newAlbum.value = data;
};

/** 子元件建立完相簿後 會更新data */
const initData = async () => {
  nowMapItem.value = ""; //清空type
  await getAlbumData();
  closeNewInfoWindow();
  clickMarker(albumList.value[albumList.value.length - 1]);
};

/**
 * map Item 定義
 * @property {number | string} newDate - 建立時間
 * @property {string} locationStaus - 選取地點方式 address | map
 * @property {string} title - 相簿名稱
 * @property {string} depiction - 相簿敘述
 * @property {string} remark - 備註
 * @property {number} lat - Y
 * @property {number} lng - X
 * @property {string} type - 類型
 * @property {string} address - 地址
 * @property {string} imgs - 圖片
 */
interface mapItemStruct {
  newDate: number | string;
  locationStaus: "address" | "map";
  title: string;
  depiction: string;
  remark: string;
  lat: number | string;
  lng: number | string;
  type: string;
  address?: string;
  imgs: string;
}

/**
 * 建立相簿 定義
 * @property {mapItemStruct} item - data
 * @property {string[]} imgsSrc - [] img src
 * @property {number} uploadNum - 上傳到第幾個圖片 src
 * @property {boolean} uploadStatus - 上傳圖片時的loading狀態
 */
export interface newAlbumStruct {
  item: mapItemStruct;
  imgsSrc: string[];
  uploadNum: number;
  uploadStatus: boolean;
}

/**
 * 類型 定義
 * @property {string} label - title
 * @property {string} value - value
 * @property {boolean} disabled - 是否禁用
 */
export interface typeStruct {
  label: string;
  value: string;
  disabled?: boolean;
}
</script>
