import { Box, Divider, Input, Select, Stack, Text } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { yearMonth } from ".";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";

import { useInputValue } from "../hooks/userInputValue";
import { useSelectOnChange } from "../hooks/useSelectOnChange";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Progress = ({ year_month }) => {
	//年月をDBから取得ものを配列のStateとして保持
	const yearMonthArray: yearMonth[] = [...year_month];

	//登録済みの年月のみの配列を生成。後ほどincludeとしてfilterで使用
	const setSelectYearMonth = useSetRecoilState(selectOptionYearMonth);
	useEffect(() => {
		const selectYearMonthList = yearMonthArray.map((item) => {
			return item.year_month;
		});
		setSelectYearMonth(selectYearMonthList);
	}, []); //yearMonthが更新されるたびに更新

	//作成された年月をselectのopとして利用
	const selectOption = useRecoilValue(selectOptionYearMonth);
	//選択されている年月用のstateSet
	const setSelectedYearMonth = useSetRecoilState(onSelectYearMonthState);

	const selectYearMonth = useSelectOnChange();
	useEffect(() => {
		setSelectedYearMonth(selectYearMonth.value);
	}, [selectYearMonth.value]);

	const uniqueUserGoalInput = useInputValue();
	const newUserGoalInput = useInputValue();
	const seminarGoalInput = useInputValue();
	const mxSeminarGoalInput = useInputValue();
	const mxSeminarUserGoalInput = useInputValue();

	const goalInputValue = [
		seminarGoalInput,
		uniqueUserGoalInput,
		newUserGoalInput,
		mxSeminarGoalInput,
		mxSeminarUserGoalInput
	];
	const goalLabel = [
		"目標開催数",
		"目標リピートユーザー数",
		"目標新規ユーザー数",
		"目標MX講座開催数",
		"目標MXユーザー数"
	];
	return (
		<>
			<Stack>
				<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
					目標値の設定
				</Text>
				<Divider />
				<Box p={6}>
					<Text fontSize={"lg"} fontWeight={"bold"}>
						目標を設定する店舗と年月を選択
					</Text>

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
				</Box>
				<Box p={6}>
					{goalInputValue.map((item, index) => {
						return (
							<>
								<Text fontSize={"lg"} fontWeight={"bold"}>
									{goalLabel[index]}
								</Text>
								<Input
									type={"number"}
									value={item.value}
									onChange={item.onChangeInput}
									backgroundColor={"white"}
									marginBottom={4}
								/>
							</>
						);
					})}
				</Box>
			</Stack>
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
	return { props: { year_month, achievements }, revalidate: 10 };
};

export default Progress;
