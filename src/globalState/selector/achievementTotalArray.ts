import { selector } from "recoil";
import { achievementsArray } from "../achievementsArray";
import { onSelectedShopName } from "../onSelectedShopName";
import { onSelectYearMonthState } from "../onSelectYearMonthState";

export const achievementTotalArray = selector({
	key: "achievementTotalArray ",
	get: ({ get }) => {
		//選択した年月のatomを取得
		const onSelectYearMonth = get(onSelectYearMonthState);
		//選択した店舗のatomを取得
		const onSelectShopName = get(onSelectedShopName);
		//抽出のための初期配列生成
		const initialArray = get(achievementsArray).filter((item) => {
			if (onSelectShopName === "全店舗") {
				//全店舗の場合実績日に指定して年月を含むものだけ返す
				return item.date_of_results.includes(onSelectYearMonth);
			}
			return item.date_of_results.includes(onSelectYearMonth) && item.shop_name === onSelectShopName;
		});

		// u_usercountの配列
		const uniqueUserCountArray: number[] = initialArray.map((item) => {
			return item.u_usercount;
		});
		//new_usercountの配列
		const newUserCountArray: number[] = initialArray.map((item) => {
			return item.new_usercount;
		});
		//seminar_countの配列
		const seminarCountArray: number[] = initialArray.map((item) => {
			return item.seminar_count;
		});
		// 	mx_seminar_countの配列
		const mxSeminarCountArray: number[] = initialArray.map((item) => {
			return item.mx_seminar_count;
		});
		// 	mx_usercountの配列
		const mxUserCountArray: number[] = initialArray.map((item) => {
			return item.mx_usercount;
		});
		const countArrays = [
			seminarCountArray,
			uniqueUserCountArray,
			newUserCountArray,

			mxSeminarCountArray,
			mxUserCountArray
		];

		//それぞれの配列の合計値を計算
		const totalCalcFunc = (target: number[]) => {
			const totalCalc = target.reduce((sum, element) => {
				return sum + element;
			}, 0);
			return totalCalc;
		};
		//プロパティ名を付けたオブジェクト配列を生成
		const labelName = ["講座開催数", "リピートユーザー数", "新規ユーザー数", "MX講座開催数", "MX講座ユーザー数"];
		const countTotalArray = countArrays.map((item, index) => {
			return { label: labelName[index], total: totalCalcFunc(item) };
		});

		return countTotalArray;
	}
});
