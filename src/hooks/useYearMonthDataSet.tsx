import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { onSelectedShopName } from "../globalState/index/onSelectedShopName";
import { onSelectYearMonthState } from "../globalState/index/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/index/selectOptionYearMonth";
import { shopNameArray } from "../globalState/index/shopNameArray";
import { yearMonth } from "../pages";
import { useSelectOnChange } from "./useSelectOnChange";

export const useYearMonthDataSet = ({ year_month }) => {
	//年月をDBから取得ものを配列のStateとして保持
	const yearMonthArray: yearMonth[] = [...year_month];

	//登録済みの年月のみの配列を生成。後ほどincludeとしてfilterで使用
	const setSelectYearMonth = useSetRecoilState(selectOptionYearMonth);
	useEffect(() => {
		const selectYearMonthList = yearMonthArray.map((item) => {
			return item.year_month;
		});
		setSelectYearMonth(selectYearMonthList);
	}, []);

	//作成された年月をselectのopとして利用
	const selectOption = useRecoilValue(selectOptionYearMonth);
	//選択されている年月用のstateSet
	const setSelectedYearMonth = useSetRecoilState(onSelectYearMonthState);

	const selectYearMonth = useSelectOnChange();
	useEffect(() => {
		setSelectedYearMonth(selectYearMonth.value);
	}, [selectYearMonth.value]);

	//入力対象の店舗名配列
	const shopNameList = useRecoilValue(shopNameArray);
	//全店舗は入力対象から除外
	const inputShopName = shopNameList.filter((item) => {
		return item !== "全店舗";
	});
	const selectShopName = useSelectOnChange();

	//選択されている店舗用stateSet
	const setOnSelectShopName = useSetRecoilState(onSelectedShopName);

	useEffect(() => {
		setOnSelectShopName(selectShopName.value);
	}, [selectShopName.value]);

	return { inputShopName, selectShopName, selectOption, selectYearMonth, shopNameList };
};
