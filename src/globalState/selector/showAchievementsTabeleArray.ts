import { selector } from "recoil";
import { achievementsArray } from "../achievementsArray";
import { onSelectYearMonthState } from "../onSelectYearMonthState";

export const showAchievementsTableArray = selector({
	key: "showAchievementsTableArray ",
	get: ({ get }) => {
		//選択した年月のatomを取得
		const onSelectYearMonth = get(onSelectYearMonthState);
		//全データのatomを取得
		const allAchievements = get(achievementsArray);

		const showAchievements = allAchievements.filter((item) => {
			return item.date_of_results.includes(onSelectYearMonth);
		});

		return showAchievements;
	}
});
