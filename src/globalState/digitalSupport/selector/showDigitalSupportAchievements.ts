import { selector } from "recoil";
import { digitalSupport, digitalSupportState } from "../digitalSupportState";
import { shopNameArray } from "../../index/shopNameArray";
import { tabIndexState } from "../tabIndexState";

export const showDigitalSupportAchievements = selector({
	key: "showDigitalSupportAchievements ",
	get: ({ get }) => {
		//全データのatomを取得
		const allAchievements = get(digitalSupportState);
		//tabName取得
		const tabNameArray = get(shopNameArray).filter((item) => item !== "全店舗");
		//tabIndex取得
		const tabIndex = get(tabIndexState);

		//選択しているタブによってdigital_supportをfilterする
		const showDigitalSupport: digitalSupport[] = allAchievements.filter((item) => {
			return item.shop_name === tabNameArray[tabIndex];
		});

		return showDigitalSupport;
	}
});
