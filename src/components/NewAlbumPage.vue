<template>
  <n-spin size="medium" :show="sendDataStatus">
    <div class="dataWrap">
      <div>
        <p>相簿名稱</p>
        <n-input
          type="text"
          v-model:value="newAlbum.item.title"
          placeholder="請輸入內容"
        />
      </div>
      <div>
        <p>建立時間</p>
        <n-input type="text" :placeholder="newAlbum.item.newDate" disabled />
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
              :checked="newAlbum.item.locationStaus === 'map'"
              value="map"
              name="locationMode"
              @click="newAlbum.item.locationStaus = 'map'"
            >
              地圖選取
            </n-radio>
          </div>
        </div>
        <div class="modeDataWrap">
          <div
            class="addressWrap"
            v-if="newAlbum.item.locationStaus === 'address'"
          >
            <n-input type="text" placeholder="請輸入內容" />
          </div>
          <div class="XYWrap" v-else>
            <div>
              <p>X 軸</p>
              <n-input
                type="text"
                v-model:value="newAlbum.item.lng"
                placeholder="請輸入內容"
                disabled
              />
            </div>
            <div>
              <p>Y 軸</p>
              <n-input
                type="text"
                v-model:value="newAlbum.item.lat"
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
            v-model:value="newAlbum.item.type"
            :options="props.options"
            placeholder="請選擇類型"
          />
        </n-space>
      </div>
      <div class="imgsWrap">
        <p>照片</p>
        <div class="imgsDataWrap">
          <n-spin size="medium" :show="newAlbum.uploadStatus">
            <template v-for="(item, index) in newAlbum.imgsSrc" :key="item">
              <div v-if="item !== ''" class="imgsSrcWrap">
                <div
                  class="deleteIconWrap"
                  @click="$emit('deleteImage', 'new', newAlbum.imgsSrc, index)"
                >
                  <n-icon :component="Add20Filled" size="18" />
                </div>
                <n-image :src="item" />
              </div>
            </template>
            <div class="uploadImgWrap" v-if="newAlbum.imgsSrc.length < 10">
              <label enctype="multipart/form-data">
                <n-icon :component="Add20Filled" size="25" />
                <input
                  type="file"
                  max="10"
                  id="new_img_uploader"
                  accept="image/*"
                  @change="
                    $emit(
                      'uploadImages',
                      $event,
                      'new_img_uploader',
                      newAlbum.imgsSrc,
                      newAlbum.uploadNum,
                      'new'
                    )
                  "
                />
              </label>
            </div>
          </n-spin>
        </div>
      </div>
      <div class="albumDepictionWrap">
        <p>相簿說明</p>
        <n-input
          class="textareaStyle"
          type="textarea"
          v-model:value="newAlbum.item.depiction"
          placeholder="請輸入內容"
        />
      </div>
      <div class="remarkWrap">
        <p>備註</p>
        <n-input
          class="textareaStyle"
          type="textarea"
          v-model:value="newAlbum.item.remark"
          placeholder="請輸入內容"
        />
      </div>
    </div>
    <div class="sendDataWrap">
      <div @click="clearData">
        <n-icon :component="ArrowClockwise32Filled" size="15" />
        <div>清除</div>
      </div>
      <div @click="sendData">
        <n-icon :component="Checkmark20Filled" size="15" />
        <div>儲存</div>
      </div>
    </div>
  </n-spin>
</template>
<style scoped lang="scss">
@import "@/styles/variables";
@import "@/styles/mixins/rwd";
@import "@/styles/mixins/scroll";
@import "@/styles/global";
@import "@/styles/pages/components/NewAlbumPage";
</style>
<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useMessage, useDialog, NIcon } from "naive-ui";
import { apiAuth, AxiosResponse } from "@/plugins/axios";
import type { mapItemStruct } from "@/views/MapView.vue";
import type { typeStruct } from "@/views/MapView.vue";
import {
  Add20Filled,
  Delete48Regular,
  ArrowClockwise32Filled,
  Checkmark20Filled,
} from "@vicons/fluent";

const message = useMessage();
const dialog = useDialog();

/** 送出建立資料載入狀態 */
const sendDataStatus: Ref<boolean> = ref(false);

/** 傳入的 Data */
const props = defineProps<{
  data: mapItemStruct;
  options: typeStruct[];
}>();

const newAlbum = ref(JSON.parse(JSON.stringify(props.data)) as mapItemStruct);

/** 監聽更新父元件傳來的data  lng lat newDate*/
watch(
  () => props.data,
  () => {
    if (!props.data.item.updateStatus) {
      //更新狀態是false 就更新以下幾個
      newAlbum.value.item.lng = props.data.item.lng;
      newAlbum.value.item.lat = props.data.item.lat;
      newAlbum.value.item.newDate = props.data.item.newDate;
      newAlbum.value.uploadStatus = props.data.uploadStatus;
    } else {
      newAlbum.value = JSON.parse(JSON.stringify(props.data)) as mapItemStruct;
    }
  },
  { deep: true }
);

/** 清除建立資料 */
const clearData = () => {
  dialog.warning({
    title: "警告",
    content: "清除資料 ? ",
    positiveText: "確定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: () => {
      //重置
      emit("initNewAlbum");
    },
  });
};

/** 送出建立資料 */
const sendData = async () => {
  sendDataStatus.value = true;
  //把img取出
  newAlbum.value.item.imgs = newAlbum.value.imgsSrc
    .filter((item) => item !== "")
    .map((item) => item)
    .join(",");

  if (newAlbum.value.item.title === "") {
    message.warning("請輸入相簿名稱");
    return;
  }
  if (newAlbum.value.item.type === "") {
    message.warning("請選擇類型");
    return;
  }
  if (newAlbum.value.item.depiction === "") {
    message.warning("請輸入相簿敘述");
    return;
  }
  if (newAlbum.value.item.remark === "") {
    message.warning("請輸入備註");
    return;
  }
  if (newAlbum.value.item.imgs.length === 0) {
    message.warning("請上傳照片");
    return;
  }
  if (newAlbum.value.item.lat === "" || newAlbum.value.item.lng === "") {
    message.warning("請選擇地點");
    return;
  }
  const _formData = new FormData();
  _formData.append("Name", newAlbum.value.item.title);
  _formData.append("Time", String(newAlbum.value.item.newDate));
  _formData.append("Lat", String(newAlbum.value.item.lat));
  _formData.append("Lng", String(newAlbum.value.item.lng));
  _formData.append("Type", String(newAlbum.value.item.type));
  _formData.append("Depiction", newAlbum.value.item.depiction);
  _formData.append("Remark", newAlbum.value.item.remark);
  _formData.append("Imgs", String(newAlbum.value.item.imgs));
  try {
    const res = (await apiAuth.post(
      "/api/GoogleSheet/album",
      _formData
    )) as AxiosResponse<any, any>;
    if (res.status === 200) {
      emit("addedSuccess");
      message.success("新增成功");
      sendDataStatus.value = false;
      props.data.item.updateStatus = true;
      //重置
      emit("initNewAlbum");
    }
  } catch (err) {
    console.log(err);
    message.error("新增失敗");
  }
};

const emit = defineEmits<{
  // 更新狀態
  (e: "deleteImage", type: string, data: string[], imgIndex: number): void;
  (e: "initNewAlbum" | "addedSuccess"): void;
  (e: "updateNewAlbum", data: mapItemStruct): void;
  (
    e: "uploadImages",
    event: Event,
    uploaderId: string,
    imgsSrc: string[],
    uploadNum: number,
    type: string
  ): void;
}>();

/** 更新至父元件 newAlbum */
watch(
  () => newAlbum.value,
  () => {
    emit("updateNewAlbum", newAlbum.value);
  },
  { deep: true }
);
</script>
