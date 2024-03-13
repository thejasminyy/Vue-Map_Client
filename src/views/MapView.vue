<template>
  <div class="mapWrap contentWrap">
    <div class="googleMapWrap">
      <GoogleMap
        api-key="AIzaSyDYhNZqEgtUM9ap_OvDRxDsZr_SANI4VWo"
        :center="center"
        :zoom="15"
        @rightclick="handleRightClick"
      >
        <Marker :options="{ position: center }" />
      </GoogleMap>
      <div class="dataInfoWrap"></div>
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
              <n-input type="text" placeholder="請輸入內容" />
            </div>
            <div>
              <p>建立時間</p>
              <n-input type="text" :placeholder="newMapItem.newDate" disabled />
            </div>
            <div class="locationWrap">
              <div class="modeWrap">
                <p>選取地點方式</p>
                <div>
                  <n-radio
                    :checked="newMapItem.locationStaus === 'address'"
                    value="address"
                    name="locationMode"
                    @click="newMapItem.locationStaus = 'address'"
                  >
                    地址
                  </n-radio>
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
                    <n-input type="text" placeholder="請輸入內容" />
                  </div>
                  <div>
                    <p>Y 軸</p>
                    <n-input type="text" placeholder="請輸入內容" />
                  </div>
                </div>
              </div>
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
              <n-input type="textarea" placeholder="請輸入內容" />
            </div>
            <div class="remarkWrap">
              <p>備註</p>
              <n-input type="textarea" placeholder="請輸入內容" />
            </div>
          </div>
          <div class="sendDataWrap">
            <button>清除</button>
            <button>儲存</button>
          </div>
        </section>
      </div>
    </div>
    <!-- <div class="mapInfoWrap">
      <div class="title">麥當勞</div>
      <div class="main">
        <p>建立時間:2024-01-01</p>
        <p>說明 : J最愛吃的</p>
        <p>備註 : J最愛吃的</p>
      </div>
    </div> -->
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
import { ref, type Ref, toRefs } from "vue";
import { Add20Filled } from "@vicons/fluent";
import moment from "moment";
import { useMessage } from "naive-ui";
import { apiAuth, AxiosResponse } from "@/plugins/axios";

const message = useMessage();

const center = ref({ lat: 24.976130350291626, lng: 121.44213253899649 } as {
  lat: number;
  lng: number;
});

/** 建立map data item */
const newMapItem = ref({
  newDate: "",
  locationStaus: "address",
} as mapItemStruct);
/** 上傳圖片 src */
const imgsSrc = ref([] as imgSrcStruct[]);
/** 上傳到第幾個圖片 src */
const nowUploadNum: Ref<number> = ref(0);
/** 上傳圖片時的loading狀態 */
const uploadImg = ref(false);

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
    newMapItem.value.newDate = moment(Date.now()).format("YYYY-MM-DD hh:mm:ss");
    for (let i = 0; i < 10; i++) {
      const newObj = {} as imgSrcStruct;
      newObj.id = i;
      newObj.imgSrc = "";
      imgsSrc.value.push(newObj);
    }
  }
};
const handleRightClick = (event: any) => {
  // console.log(event);
  // console.log(event.fi.x);
  // console.log(event.fi.y);
  // 在這裡處理右鍵點擊事件，獲取點擊位置的經緯度座標
  const latLng = event.latLng;
  const lat = latLng.lat();
  const lng = latLng.lng();

  // 在控制台輸出經緯度座標
  console.log("Latitude:", lat);
  console.log("Longitude:", lng);
};

/**上傳圖片轉換成 base64 (id, 存 base64 位置 */
const uploadImgs = (
  e: any,
  id: string,
  storePhotesPlace: any,
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
  console.log(imgsSrc.value);
};

/** 壓縮 base64 圖片(chatgpt 寫法修改) */
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
/** 上傳圖片 */
const uploadImage = async (base64: string) => {
  const formData = new FormData();
  formData.append("base64string", base64);
  try {
    const res = await apiAuth.post("/api/Imgur", formData);
    uploadImg.value = false;
    return res.data.split(".jpeg")[0];
  } catch (err) {
    uploadImg.value = false;
    message.success("上傳失敗");
    console.log(err);
  }
};
/** 刪除 已上傳完的圖片 */
const deleteImage = (id: number) => {
  imgsSrc.value = imgsSrc.value.filter((item) => item.id !== id);
};

/**
 * map Item 定義
 * @property {number | string} newDate - 建立時間
 */
interface mapItemStruct {
  newDate: number | string;
  locationStaus: "address" | "map";
  imgs: [];
}
interface imgSrcStruct {
  id: number;
  imgSrc: string;
}
</script>
