import { atom } from "recoil";
import format from "date-fns/format";

const initialDate = new Date();
const dateValue = format(initialDate, "yyyy/MM/dd");
export const dateState = atom({
	key: "dateState",
	default: dateValue
});
