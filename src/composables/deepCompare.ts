import type { albumStruct } from "@/views/HomeView.vue";
// 比對兩個物件內容是否相同
export function deepCompare(obj1:albumStruct, obj2:albumStruct) {
  // 兩個物件都是 null 或者 undefined
  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
    return obj1 === obj2;
  }
  
  // 兩個物件都是類型不同，回傳false
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  
  // 兩個物件原始值類型，直接比較兩個物件的值
  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }
  
  // 取出物件的key
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  //使用遞迴對比值
  for (let key of keys1) {
    if (!deepCompare(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
  }