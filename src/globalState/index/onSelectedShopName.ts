import { atom } from "recoil";

const initialData = "";
export const onSelectedShopName = atom({
	key: "onSelectedShopName",
	default: initialData
});
