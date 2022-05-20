import { atom } from "recoil";

const initialYearMonthData = {
	year_month: "",
	shop_name: "塩山店"
};
export const yearMonthState = atom({
	key: "yearMonthState",
	default: initialYearMonthData
});
