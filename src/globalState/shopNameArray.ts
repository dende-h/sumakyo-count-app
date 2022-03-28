import { atom } from "recoil";

const initialDate = ["塩山店", "東山梨店", "一宮イッツモア店", "全店舗"];

export const shopNameArray = atom({
	key: "shopNameArray",
	default: initialDate
});
