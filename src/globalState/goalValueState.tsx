import { atom } from "recoil";
import { goal } from "../pages/goal_setting";

const initialData: goal[] = [
	{
		u_user_goal: 0,
		new_user_goal: 0,
		seminar_goal: 0,
		mx_seminar_goal: 0,
		mx_user_goal: 0,
		shop_name_month: ""
	}
];

export const goalValueState = atom({
	key: "goalValueState",
	default: initialData
});
