import { atom } from "recoil";
import { userCount } from "../pages";

//データ初期化
const initialDate: userCount[] = [
	{
		u_usercount: 0,
		new_usercount: 0,
		seminar_count: 0,
		mx_seminar_count: 0,
		mx_usercount: 0,
		date_of_results: ""
	}
];

export const achievementsArray = atom({
	key: "achievementsArray",
	default: initialDate
});
