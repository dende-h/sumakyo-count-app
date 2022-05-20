import { selector } from "recoil";
import { onSelectedShopName } from "../../index/onSelectedShopName";
import { digitalSupportState } from "../../digitalSupport/digitalSupportState";

export const participantTotal = selector({
	key: "participantTotal ",
	get: ({ get }) => {
		//選択した店舗のatomを取得
		const onSelectShopName = get(onSelectedShopName);
		//抽出のための初期配列生成
		const initialArray = get(digitalSupportState).filter((item) => {
			return item.shop_name === onSelectShopName;
		});

		// participantsの配列
		const participantsCountArray: number[] = initialArray.map((item) => {
			return item.participants;
		});

		//それぞれの配列の合計値を計算
		const totalCalcFunc = (target: number[]) => {
			const totalCalc = target.reduce((sum, element) => {
				return sum + element;
			}, 0);
			return totalCalc;
		};
		const participantTotal = totalCalcFunc(participantsCountArray);

		return participantTotal;
	}
});
