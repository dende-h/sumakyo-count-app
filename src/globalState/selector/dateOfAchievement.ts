import { selector } from "recoil";
import { achievementsArray } from "../achievementsArray";
import { dateState } from "../dateState";
import { onSelectedShopName } from "../onSelectedShopName";

export const dateOfAchievement = selector({
	key: " dateOfAchievement  ",
	get: ({ get }) => {
		//選択した日付のatomを取得
		const selectedDate = get(dateState);
		//選択した店舗のatomを取得
		const onSelectShopName = get(onSelectedShopName);
		//抽出のための初期配列生成
		const initialArray = get(achievementsArray).filter((item) => {
			if (onSelectShopName === "全店舗") {
				//全店舗の場合実績日に指定した日を含むものだけ返す
				return item.date_of_results.includes(selectedDate);
			}
			return item.date_of_results.includes(selectedDate) && item.shop_name === onSelectShopName;
		});

		return initialArray;
	}
});
