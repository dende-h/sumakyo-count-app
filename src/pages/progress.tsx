import { Box, Button, Center, Divider, Input, Select, Spinner, Stack, Text } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { yearMonth } from ".";
import { isLoadingState } from "../globalState/isLoadingState";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";
import { shopNameArray } from "../globalState/shopNameArray";

import { useInputValue } from "../hooks/userInputValue";
import { useSelectOnChange } from "../hooks/useSelectOnChange";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

//goalの型
export type goal = {
	id?: number;
	u_user_goal: number;
	new_user_goal: number;
	seminar_goal: number;
	mx_seminar_goal: number;
	mx_user_goal: number;
	shop_name_month: string;
};

const Progress = ({ year_month }) => {
	//Loading
	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	//リダイレクト用
	const router = useRouter();
	//目標登録成功フラグ
	const [isSuccess, setIsSuccess] = useState(false);

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

	//入力対象の店舗名配列
	const shopNameList = useRecoilValue(shopNameArray);
	//全店舗は入力対象から除外
	const inputShopName = shopNameList.filter((item) => {
		return item !== "全店舗";
	});
	const selectShopName = useSelectOnChange();

	//目標を設定するインプットフォームを定義
	const uniqueUserGoalInput = useInputValue();
	const newUserGoalInput = useInputValue();
	const seminarGoalInput = useInputValue();
	const mxSeminarGoalInput = useInputValue();
	const mxSeminarUserGoalInput = useInputValue();
	//配列にしてmap
	const goalInputValue = [
		seminarGoalInput,
		uniqueUserGoalInput,
		newUserGoalInput,
		mxSeminarGoalInput,
		mxSeminarUserGoalInput
	];
	//対応するラベルの配列
	const goalLabel = [
		"目標開催数",
		"目標リピートユーザー数",
		"目標新規ユーザー数",
		"目標MX講座開催数",
		"目標MXユーザー数"
	];

	//DBに送るデータの作成
	//店舗名：年月データ
	const [shopNameMonth, setShopNameMonth] = useState<string>("");

	useEffect(() => {
		setShopNameMonth(`${selectShopName.value}:${selectYearMonth.value}`);
	}, [selectShopName.value, selectYearMonth.value]);

	//入力した目標値データ
	const initialData = {
		u_user_goal: 0,
		new_user_goal: 0,
		seminar_goal: 0,
		mx_seminar_goal: 0,
		mx_user_goal: 0,
		shop_name_month: ""
	};

	const [goal, setGoal] = useState<goal>(initialData);

	useEffect(() => {
		setGoal({
			...goal,
			u_user_goal: parseInt(uniqueUserGoalInput.value),
			new_user_goal: parseInt(newUserGoalInput.value),
			seminar_goal: parseInt(seminarGoalInput.value),
			mx_seminar_goal: parseInt(mxSeminarGoalInput.value),
			mx_user_goal: parseInt(mxSeminarUserGoalInput.value),
			shop_name_month: shopNameMonth
		});
	}, [
		uniqueUserGoalInput.value,
		newUserGoalInput.value,
		seminarGoalInput.value,
		mxSeminarGoalInput.value,
		mxSeminarUserGoalInput.value,
		shopNameMonth
	]);

	//DBへの登録

	const onClickGoalSet = async () => {
		setIsLoading(true);

		const { error } = await supabase.from("goal_value").insert(goal);

		if (error) {
			//エラー時のコンソール表示
			toast.error(error.message);
			setIsLoading(false);
		} else {
			setIsSuccess(true);
			//ページのリダイレクト
			router.push("/dashboard");
			setIsLoading(false);
		}
	};

	return (
		<>
			{isSuccess ? (
				<Center p={10}>
					<Spinner />
				</Center>
			) : (
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
						<Select onChange={selectShopName.onChangeSelect} placeholder="店舗を選択" backgroundColor={"white"}>
							{inputShopName.map((item) => {
								return (
									<option key={item} value={item}>
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
										placeholder={"目標数を入力"}
									/>
								</>
							);
						})}
					</Box>
					<Box>
						<Button
							colorScheme="teal"
							onClick={onClickGoalSet}
							isDisabled={selectShopName.value === "" || selectYearMonth.value === "" || isLoading}
							isLoading={isLoading}
						>
							目標を設定する
						</Button>
					</Box>
				</Stack>
			)}
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
