import { useUser } from "@auth0/nextjs-auth0";
import { Box, Button, Center, Divider, Input, Select, Spinner, Stack, Text } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { isLoadingState } from "../globalState/index/isLoadingState";
import { useInputValue } from "../hooks/userInputValue";
import { useYearMonthDataSet } from "../hooks/useYearMonthDataSet";

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

const GoalSetting = ({ year_month }) => {
	const router = useRouter();
	const { user } = useUser();
	if (!user) {
		typeof window === "undefined" ? undefined : router.replace("/api/auth/login");
	}

	//Loading
	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

	//目標登録成功フラグ
	const [isSuccess, setIsSuccess] = useState(false);

	const { inputShopName, selectOption, selectShopName, selectYearMonth } = useYearMonthDataSet({ year_month });

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
			{user ? (
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
			) : (
				<Box m={4}>
					<Text fontSize={"20px"}>認証されていません。</Text>
					<Text fontSize={"20px"}>ログインページへ遷移します。</Text>
				</Box>
			)}
		</>
	);
};

export const getStaticProps = async () => {
	const { data: year_month, error: year_monthError } = await supabase.from("year_month").select("*");
	if (year_monthError) {
	}

	return { props: { year_month }, revalidate: 10 };
};

export default GoalSetting;
