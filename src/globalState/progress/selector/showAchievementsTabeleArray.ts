import { selector } from "recoil";
import { achievementsArray } from "../achievementsArray";
import { onSelectedShopName } from "../../index/onSelectedShopName";
import { onSelectYearMonthState } from "../../index/onSelectYearMonthState";

export const showAchievementsTableArray = selector({
	key: "showAchievementsTableArray ",
	get: ({ get }) => {
		//選択した年月のatomを取得
		const onSelectYearMonth = get(onSelectYearMonthState);
		//選択した店舗のatomを取得
		const onSelectShopName = get(onSelectedShopName);
		//全データのatomを取得
		const allAchievements = get(achievementsArray);

		//全店舗を選択している場合は年月のみのfilter
		const showAchievements = allAchievements.filter((item) => {
			if (onSelectShopName === "全店舗") {
				return item.date_of_results.includes(onSelectYearMonth);
			}

			return item.date_of_results.includes(onSelectYearMonth) && item.shop_name === onSelectShopName;
		});

		return showAchievements;
	}
});
