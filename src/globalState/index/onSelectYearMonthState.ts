import { atom } from "recoil";

const initialData = "";
export const onSelectYearMonthState = atom({
	key: "onSelectYearMonthState",
	default: initialData
});
