import { Box, Center, Select, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { yearMonth } from ".";
import { DashBoardCard } from "../components/DashBoardCard";
import { useSelectOnChange } from "../components/useSelectOnChange";
import { achievementsArray } from "../globalState/achievementsArray";
import { onSelectedShopName } from "../globalState/onSelectedShopName";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";
import { achievementTotalArray } from "../globalState/selector/achievementTotalArray";
import { shopNameArray } from "../globalState/shopNameArray";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DashBoard = ({ achievements, year_month }) => {
	//年月とショップ名をDBから取得ものを配列のStateとして保持
	const [yearMonthArray, setYearMonthArray] = useState<yearMonth[]>([...year_month]);

	//登録済みの年月のみの配列を生成。後ほどincludeとしてfilterで使用
	const setSelectYearMonth = useSetRecoilState(selectOptionYearMonth);
	useEffect(() => {
		const selectYearMonthList = yearMonthArray.map((item) => {
			return item.year_month;
		});
		setSelectYearMonth(selectYearMonthList);
	}, [yearMonthArray]); //yearMonthが更新されるたびに更新

	//実績データの取得とglobalStateへの登録
	const setAchievements = useSetRecoilState(achievementsArray);
	useEffect(() => {
		setAchievements(achievements);
	}, []);
	//作成された年月をselectのopとして利用
	const selectOption = useRecoilValue(selectOptionYearMonth);
	//選択されている年月用のstate
	const [selectedYearMonth, setSelectedYearMonth] = useRecoilState(onSelectYearMonthState);

	const selectYearMonth = useSelectOnChange();
	useEffect(() => {
		setSelectedYearMonth(selectYearMonth.value);
	}, [selectYearMonth.value]);

	//店舗selectのopとして利用
	const selectOptionShopName = useRecoilValue(shopNameArray);
	//選択されている店舗用state
	const [onSelectShopName, setOnSelectShopName] = useRecoilState(onSelectedShopName);
	const selectShopName = useSelectOnChange();
	useEffect(() => {
		setOnSelectShopName(selectShopName.value);
	}, [selectShopName.value]);

	const totalAchievements = useRecoilValue(achievementTotalArray);
	console.log(totalAchievements);

	return (
		<>
			<Stack p={2}>
				<Select
					onChange={selectYearMonth.onChangeSelect}
					placeholder={"店舗を選択"}
					defaultValue={""}
					backgroundColor={"white"}
				>
					{selectOption.map((item) => {
						return (
							<option key={item} value={`${item}`}>
								{item}
							</option>
						);
					})}
				</Select>
				<Select
					onChange={selectShopName.onChangeSelect}
					placeholder={"店舗を選択"}
					defaultValue={""}
					backgroundColor={"white"}
				>
					{selectOptionShopName.map((item) => {
						return (
							<option key={item} value={`${item}`}>
								{item}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Box>
				<Wrap p={"4"}>
					{totalAchievements.map((item) => {
						return (
							<WrapItem _hover={{ cursor: "pointer" }}>
								<DashBoardCard key={item.label} label={item.label} total={item.total} />
							</WrapItem>
						);
					})}
				</Wrap>
			</Box>
		</>
	);
};
export const getServerSideProps = async () => {
	const { data: year_month, error: year_monthError } = await supabase.from("year_month").select("*");
	if (year_monthError) {
		console.log(year_monthError.message);
	}
	const { data: achievements, error: achievementsError } = await supabase.from("achievements").select("*");
	if (achievementsError) {
		console.log(achievementsError.message);
	}
	return { props: { achievements, year_month } };
};

export default DashBoard;
