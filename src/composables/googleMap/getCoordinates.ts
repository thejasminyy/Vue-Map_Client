//點擊事件，取得點擊位置的經緯度座標
export const getCoordinates = (event: any): { lat: number; lng: number } => {
  const latLng = event.latLng;
  const lat = latLng.lat(); //Y
  const lng = latLng.lng(); //X
  return { lat,lng } //回傳
}