import { selector } from "recoil";
import { achievementsArray } from "../achievementsArray";
import { onSelectYearMonthState } from "../onSelectYearMonthState";

export const achievementTotal = selector({
	key: "achievementTotal ",
	get: ({ get }) => {
		const onSelectYearMonth = get(onSelectYearMonthState);
		const initialArray = get(achievementsArray).filter((item) => {
			//実績日に指定して年月を含むものだけ返す
			return item.date_of_results.includes(onSelectYearMonth);
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
			return item.seminar_count;
		});
		// 	mx_usercountの配列
		const mxUserCountArray: number[] = initialArray.map((item) => {
			return item.mx_usercount;
		});
		const countArrays = [
			uniqueUserCountArray,
			newUserCountArray,
			seminarCountArray,
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
		const labelName = ["ユニークユーザー数", "新規ユーザー数", "講座開催数", "MX講座開催数", "MX講座ユーザー数"];
		const countTotalArray = countArrays.map((item, index) => {
			return { label: labelName[index], total: totalCalcFunc(item) };
		});

		return countTotalArray;
	}
});
