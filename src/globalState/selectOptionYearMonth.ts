import { atom } from "recoil";

const initialSelectYearMonthData = [""];
export const selectOptionYearMonth = atom({
	key: "selectOptionYearMonth",
	default: initialSelectYearMonthData
});
