import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useYearMonthDataSet } from "../hooks/useYearMonthDataSet";
import { useAchievementDataSet } from "../hooks/useAchievementDataSet";
import {
	Box,
	Select,
	Stack,
	Text,
	Button,
	Wrap,
	WrapItem,
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	HStack
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { goalValueState } from "../globalState/goalValueState";
import { useEffect } from "react";
import { ProgressCard } from "../components/ProgressCard";
import { onSelectedShopName } from "../globalState/onSelectedShopName";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Progress = ({ year_month, achievements, goalValue }) => {
	const { inputShopName, selectOption, selectShopName, selectYearMonth, shopNameList } = useYearMonthDataSet({
		year_month
	});

	const { totalAchievements, showAchievements } = useAchievementDataSet({ achievements });

	const [goal, setGoal] = useRecoilState(goalValueState);

	useEffect(() => {
		setGoal(goalValue);
	}, []);

	console.log(goal);

	const onSelectShopName = useRecoilValue(onSelectedShopName);
	const onSelectYearMonth = useRecoilValue(onSelectYearMonthState);

	//選択された店舗と年月で目標をfilter
	const selectedGoalValueArray = goal.filter((item) => {
		return item.shop_name_month.includes(onSelectShopName) && item.shop_name_month.includes(onSelectYearMonth);
	});

	//オブジェクトに変換
	const selectedGoalValueObjectArray = { ...selectedGoalValueArray };
	const selectedGoalValueObject = selectedGoalValueObjectArray[0];
	console.log(selectedGoalValueObject);

	//現在の進捗率

	return (
		<>
			<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
				店舗と年月を選択
			</Text>
			<Stack p={2}>
				<Select
					onChange={selectYearMonth.onChangeSelect}
					placeholder={"年月を選択"}
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
					{shopNameList.map((item) => {
						return (
							<option key={item} value={`${item}`}>
								{item}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Wrap>
				{totalAchievements.map((item) => {
					return (
						<WrapItem key={item.label}>
							<ProgressCard label={item.label} total={item.total} goal={selectedGoalValueObject} />
						</WrapItem>
					);
				})}
			</Wrap>
		</>
	);
};

export const getStaticProps = async () => {
	const { data: year_month, error: year_monthError } = await supabase.from("year_month").select("*");
	if (year_monthError) {
	}
	const { data: achievements, error: achievementsError } = await supabase
		.from("achievements")
		.select("*")
		.order("date_of_results", { ascending: true });
	if (achievementsError) {
	}
	const { data: goalValue, error: goalValueError } = await supabase.from("goal_value").select("*");

	if (goalValueError) {
	}
	return { props: { year_month, achievements, goalValue }, revalidate: 10 };
};

export default Progress;
