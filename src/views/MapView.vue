<template>
  <div class="mapWrap contentWrap">
    <div class="googleMapWrap">
      <GoogleMap
        api-key="AIzaSyDYhNZqEgtUM9ap_OvDRxDsZr_SANI4VWo"
        :center="center"
        :zoom="15"
        @rightclick="getCoordinates"
      >
        <Marker :options="{ position: center }" />
      </GoogleMap>
      <div class="dataInfoWrap">
        <div class="dataMainWrap">
          <p>最新一筆相簿</p>
          <div class="infoWrap">
            <div>
              <p>相簿名稱</p>
              <!-- <n-input
                type="text"
                v-model:value="newMapItem.albumName"
                placeholder="請輸入內容"
              /> -->
              <p>{{ editAlbumItem.title }}</p>
            </div>
            <div>
              <p>建立時間</p>
              <p>{{ editAlbumItem.time }}</p>
            </div>
            <div class="locationWrap">
              <p>地點</p>
              <div>
                <div>
                  <p>X 軸</p>
                  <p>{{ editAlbumItem.lng }}</p>
                </div>
                <div>
                  <p>Y 軸</p>
                  <p>{{ editAlbumItem.lat }}</p>
                </div>
              </div>
            </div>
            <div>
              <p>類型</p>
              <p>{{ editAlbumItem.type }}</p>
            </div>
            <div>
              <p>相簿說明</p>
              <p>{{ editAlbumItem.depiction }}</p>
            </div>
            <div>
              <p>備註</p>
              <p>{{ editAlbumItem.remark }}</p>
            </div>
          </div>
          <div class="imgWrap">
            <n-image width="100" src="/img/1Njjl1n.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/rxN49KX.jpg" />
            <n-image width="100" src="/img/1Njjl1n.jpg" />
          </div>
        </div>
        <div class="dataBtnWrap">
          <button class="delete" @click="deletetData('x')">刪除</button>
          <button class="edit" v-if="!editStatus" @click="editData">
            編輯
          </button>
          <button class="cancel" v-if="editStatus" @click="cancelEdit">
            取消
          </button>
          <button class="save" v-if="editStatus">儲存</button>
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
          :class="switchDataBtn === 'search' ? '' : 'active'"
          @click="switchBtn('new')"
        >
          建立
        </button>
      </div>
      <div class="mainWrap">
        <section
          class="searchDataWrap"
          v-if="switchDataBtn === 'search'"
        ></section>
        <section class="newDataWrap" v-else>
          <div class="dataWrap">
            <div>
              <p>相簿名稱</p>
              <n-input
                type="text"
                v-model:value="newMapItem.albumName"
                placeholder="請輸入內容"
              />
            </div>
            <div>
              <p>建立時間</p>
              <n-input type="text" :placeholder="newMapItem.newDate" disabled />
            </div>
            <div class="locationWrap">
              <div class="modeWrap">
                <p>選取地點方式</p>
                <div>
                  <!-- <n-radio
                    :checked="newMapItem.locationStaus === 'address'"
                    value="address"
                    name="locationMode"
                    @click="newMapItem.locationStaus = 'address'"
                  >
                    地址
                  </n-radio> -->
                  <n-radio
                    :checked="newMapItem.locationStaus === 'map'"
                    value="map"
                    name="locationMode"
                    @click="newMapItem.locationStaus = 'map'"
                  >
                    地圖右鍵選取
                  </n-radio>
                </div>
              </div>
              <div class="modeDataWrap">
                <div
                  class="addressWrap"
                  v-if="newMapItem.locationStaus === 'address'"
                >
                  <n-input type="text" placeholder="請輸入內容" />
                </div>
                <div class="XYWrap" v-else>
                  <div>
                    <p>X 軸</p>
                    <n-input
                      type="text"
                      v-model:value="newMapItem.lat"
                      placeholder="請輸入內容"
                      disabled
                    />
                  </div>
                  <div>
                    <p>Y 軸</p>
                    <n-input
                      type="text"
                      v-model:value="newMapItem.lng"
                      placeholder="請輸入內容"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p>類型</p>
              <n-space vertical>
                <n-select
                  v-model:value="newMapItem.type"
                  :options="options"
                  placeholder="請選擇類型"
                />
              </n-space>
            </div>
            <div class="imgsWrap">
              <p>照片</p>
              <div class="imgsDataWrap">
                <n-spin size="medium" :show="uploadImg">
                  <template v-for="item in imgsSrc" :key="item">
                    <div v-if="item.imgSrc !== ''" class="imgsSrcWrap">
                      <div class="deleteIconWrap" @click="deleteImage(item.id)">
                        <n-icon :component="Add20Filled" size="18" />
                      </div>
                      <n-image :src="item.imgSrc" />
                    </div>
                  </template>
                  <div class="uploadImgWrap">
                    <label enctype="multipart/form-data">
                      <n-icon :component="Add20Filled" size="25" />
                      <input
                        type="file"
                        max="1"
                        id="img-uploader"
                        accept="image/*"
                        @change="
                          uploadImgs(
                            $event,
                            'img-uploader',
                            imgsSrc,
                            nowUploadNum
                          )
                        "
                      />
                    </label>
                  </div>
                </n-spin>
              </div>
            </div>
            <div class="photoDepictionWrap">
              <p>相簿說明</p>
              <n-input
                type="textarea"
                v-model:value="newMapItem.albumDepiction"
                placeholder="請輸入內容"
              />
            </div>
            <div class="remarkWrap">
              <p>備註</p>
              <n-input
                type="textarea"
                v-model:value="newMapItem.remark"
                placeholder="請輸入內容"
              />
            </div>
          </div>
          <div class="sendDataWrap">
            <button @click="clearData">清除</button>
            <button @click="sendData">儲存</button>
          </div>
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
} from "vue3-google-map";
import { ref, onMounted, type Ref, toRefs } from "vue";
import { Add20Filled } from "@vicons/fluent";
import moment from "moment";
import { useMessage, useDialog } from "naive-ui";
import { apiAuth, AxiosResponse } from "@/plugins/axios";
import type { albumStruct } from "@/views/HomeView.vue";

const message = useMessage();
const dialog = useDialog();

const center = ref({ lat: 24.976130350291626, lng: 121.44213253899649 } as {
  lat: number;
  lng: number;
});

/** 建立map data item */
const newMapItem = ref({
  newDate: "",
  locationStaus: "map",
  albumName: "",
  albumDepiction: "",
  remark: "",
  lat: "請輸入內容",
  lng: "請輸入內容",
  type: "",
  imgs: "",
} as mapItemStruct);

/** 類型 下拉選單內容 */
const options = ref([
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
/** 上傳圖片 src */
const imgsSrc = ref([] as imgSrcStruct[]);
/** 上傳到第幾個圖片 src */
const nowUploadNum: Ref<number> = ref(0);
/** 上傳圖片時的loading狀態 */
const uploadImg = ref(false);

/** 相簿資料 */
const albumList = ref([] as albumStruct[]);
/** 相簿編輯狀態 */
const editStatus = ref(false);
/** 相簿單筆 編輯 */
const editAlbumItem = ref({} as albumStruct);

onMounted(() => {
  getPhotoData();
});

/** 取得相簿 */
const getPhotoData = async () => {
  try {
    const res = await apiAuth.get(`/api/GoogleSheet/album?Year=`); //取全部 不帶參數
    albumList.value = [];
    if (res.status === 200) {
      albumList.value = res.data.data;
      editAlbumItem.value = JSON.parse(
        JSON.stringify(albumList.value[albumList.value.length - 1])
      ); //取得最新一筆
      // console.log(res.data.data);
    }
  } catch (err) {
    console.log(err);
  }
};

/** 目前按鈕是哪一個 */
const switchDataBtn = ref("search");
/**
 * 切換按鈕
 * @param type search || new
 */
const switchBtn = (type: string) => {
  if (type === "search") {
    switchDataBtn.value = "search";
  } else {
    switchDataBtn.value = "new";
    //切到建立 取得現在時間並轉換成字串格式
    newMapItem.value.newDate = moment().format("YYYY-MM-DD HH:mm:ss");
    for (let i = 0; i < 10; i++) {
      const newObj = {} as imgSrcStruct;
      newObj.id = i;
      newObj.imgSrc = "";
      imgsSrc.value.push(newObj);
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
  const lat = latLng.lat();
  const lng = latLng.lng();

  newMapItem.value.lat = lat;
  newMapItem.value.lng = lng;
};

/**
 * 上傳圖片轉換成 base64
 * @param e event
 * @param id id
 * @param storePhotesPlace data
 * @param imgLength 存入data位置
 */
const uploadImgs = (
  e: any,
  id: string,
  storePhotesPlace: imgSrcStruct[],
  imgLength: number
) => {
  const imgUploader: HTMLInputElement = document.querySelector(`#${id}`)!;
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = async function (event) {
    uploadImg.value = true;
    let result = "";
    storePhotesPlace[imgLength].imgSrc = "";
    if (event.target!.result!.toString().length / 1024 > 500) {
      compressBase64Image(
        event.target!.result!.toString(),
        500,
        async function (compressedBase64: string) {
          result = compressedBase64;
          storePhotesPlace[imgLength].imgSrc = await uploadImage(result); // 更新 storePhotesPlace
          nowUploadNum.value += 1;
        }
      );
    } else {
      result = event.target!.result!.toString();
      storePhotesPlace[imgLength].imgSrc = await uploadImage(result); // 更新 storePhotesPlace
      nowUploadNum.value += 1;
    }
    imgUploader.value = "";
  };
  // console.log(imgsSrc.value);
};

/**
 * 壓縮 base64 圖片
 * @param base64 base64
 * @param maxSize 壓縮後的圖片最大大小
 * @param callback 壓縮完成後回傳，將壓縮後的 base64 圖片作為參數
 */
const compressBase64Image = (
  base64: any,
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
 */
const uploadImage = async (base64: string) => {
  const formData = new FormData();
  formData.append("base64string", base64);
  try {
    const res = await apiAuth.post("/api/Imgur", formData);
    uploadImg.value = false;
    return res.data.split(".jpeg")[0];
  } catch (err) {
    uploadImg.value = false;
    message.error("上傳失敗");
    console.log(err);
  }
};

/**
 * 刪除 已上傳完的圖片
 * @param id id
 */
const deleteImage = (id: number) => {
  imgsSrc.value = imgsSrc.value.filter((item) => item.id !== id);
};
/** 清除建立資料 */
const clearData = () => {
  dialog.warning({
    title: "警告",
    content: "清除資料 ? ",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: () => {
      newMapItem.value = {
        newDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        locationStaus: "map",
        albumName: "",
        albumDepiction: "",
        remark: "",
        lat: "請輸入內容",
        lng: "請輸入內容",
        type: "",
        imgs: "",
      };
    },
  });
};
/** 送出建立資料 */
const sendData = async () => {
  //把img取出
  newMapItem.value.imgs = imgsSrc.value
    .filter((item) => item.imgSrc !== "")
    .map((item) => item.imgSrc)
    .join(",");

  if (newMapItem.value.albumName === "") {
    message.warning("請輸入相簿名稱");
    return;
  }
  if (newMapItem.value.type === "") {
    message.warning("請選擇類型");
    return;
  }
  if (newMapItem.value.albumDepiction === "") {
    message.warning("請輸入相簿敘述");
    return;
  }
  if (newMapItem.value.remark === "") {
    message.warning("請輸入備註");
    return;
  }
  if (newMapItem.value.imgs.length === 0) {
    message.warning("請上傳照片");
    return;
  }
  if (newMapItem.value.lat === "" || newMapItem.value.lng === "") {
    message.warning("請選擇地點");
    return;
  }
  const _formData = new FormData();
  _formData.append("Name", newMapItem.value.albumName);
  _formData.append("Time", String(newMapItem.value.newDate));
  _formData.append("Lat", String(newMapItem.value.lat));
  _formData.append("Lng", String(newMapItem.value.lng));
  _formData.append("Type", String(newMapItem.value.type));
  _formData.append("Depiction", newMapItem.value.albumDepiction);
  _formData.append("Remark", newMapItem.value.remark);
  _formData.append("Imgs", String(newMapItem.value.imgs));
  try {
    const res = (await apiAuth.post(
      "/api/GoogleSheet/album",
      _formData
    )) as AxiosResponse<any, any>;
    if (res.status === 200) {
      message.success("新增成功");
      //清空
      newMapItem.value = {
        newDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        locationStaus: "map",
        albumName: "",
        albumDepiction: "",
        remark: "",
        lat: "請輸入內容",
        lng: "請輸入內容",
        type: "",
        imgs: "",
      };
      imgsSrc.value = [];
    }
  } catch (err) {
    console.log(err);
    message.error("新增失敗");
  }
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
      editStatus.value = false;
    },
  });
};

/** 編輯資料 */
const editData = () => {
  editStatus.value = true;
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
        console.log(res);
      } catch (err) {
        console.log(err);
        message.error("刪除失敗");
      }
    },
  });
};
/**
 * map Item 定義
 * @property {number | string} newDate - 建立時間
 * @property {string} locationStaus - 選取地點方式 address | map
 * @property {string} albumName - 相簿名稱
 * @property {string} albumDepiction - 相簿敘述
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
  albumName: string;
  albumDepiction: string;
  remark: string;
  lat: number | string;
  lng: number | string;
  type: string;
  address?: string;
  imgs: string;
}

/**
 * img src
 * @property {number} id - 唯一值
 * @property {string} imgSrc - 圖片路徑
 */
interface imgSrcStruct {
  id: number;
  imgSrc: string;
}
</script>
