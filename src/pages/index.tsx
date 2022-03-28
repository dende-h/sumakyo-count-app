import {
	Box,
	Button,
	Center,
	Divider,
	Flex,
	HStack,
	IconButton,
	Input,
	Select,
	Stack,
	Text,
	Wrap,
	WrapItem
} from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useCountUpDown } from "../components/useCountUpDown";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dateState } from "../globalState/dateState";
import { useSelectOnChange } from "../components/useSelectOnChange";
import { achievementState } from "../globalState/achievementState";
import { achievementsArray } from "../globalState/achievementsArray";
import { yearMonthState } from "../globalState/yearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";

import toast from "react-hot-toast";
import { shopNameArray } from "../globalState/shopNameArray";
import { InputItemsCard } from "../components/InputItemsCard";

export type yearMonth = {
	id?: number;
	created_at?: string;
	year_month: string;
	user_id?: string;
};

export type userCount = {
	id?: number;
	created_at?: string;
	u_usercount: number;
	new_usercount: number;
	seminar_count: number;
	mx_seminar_count: number;
	mx_usercount: number;
	user_id?: number;
	year_month_id?: number;
	date_of_results: string;
	shop_name: string;
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Index = ({ year_month, achievements }) => {
	const [loading, setLoading] = useState(false);

	//実績データの取得とglobalStateへの登録
	const setAchievements = useSetRecoilState(achievementsArray);
	useEffect(() => {
		setAchievements(achievements);
		console.log(achievements);
	}, []);

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

	// //ショップ名を取得
	// const shopNameList = yearMonthArray.map((item) => {
	// 	return item.shop_name;
	// });
	// const shopName = shopNameList[0]; //塩山店

	//datepickerで選択した日付（文字列型）
	const inputDate = useRecoilValue(dateState);

	//入力対象の店舗名配列
	const shopNameList = useRecoilValue(shopNameArray);
	const selectShopName = useSelectOnChange();

	//それぞれの実績入力データ（カウントアップダウン）（数値型）
	const seminarCount = useCountUpDown();
	const uniqueUserCount = useCountUpDown();
	const newUserCount = useCountUpDown();
	const mxSeminarCount = useCountUpDown();
	const mxUserCount = useCountUpDown();
	//配列化
	const inputItemsArray = [seminarCount, uniqueUserCount, newUserCount, mxSeminarCount, mxUserCount];
	const itemLabel = ["講座開催数", "ユニークユーザー数", "新規ユーザー数", "MX講座開催数", "MX講座ユーザー数"];

	//データを書き込むためのオブジェクト定義
	const [achievement, setAchievement] = useState<userCount>();

	useEffect(() => {
		setAchievement({
			...achievement,
			u_usercount: uniqueUserCount.count,
			new_usercount: newUserCount.count,
			seminar_count: seminarCount.count,
			mx_seminar_count: mxSeminarCount.count,
			mx_usercount: mxUserCount.count,
			date_of_results: inputDate,
			shop_name: selectShopName.value
		});
	}, [
		uniqueUserCount.count,
		newUserCount.count,
		seminarCount.count,
		mxSeminarCount.count,
		mxUserCount.count,
		inputDate,
		selectShopName.value
	]);

	//送信ボタンを押したときのinsartAPI
	const onSubmit = async () => {
		setLoading(true);

		const { error } = await supabase.from("achievements").insert(achievement);

		//カウントデータの初期化
		seminarCount.setCount(0);
		uniqueUserCount.setCount(0);
		newUserCount.setCount(0);
		mxSeminarCount.setCount(0);
		mxUserCount.setCount(0);
		if (error) {
			//エラー時のコンソール表示
			toast.error(error.message);
			setLoading(false);
		} else {
			toast.success("登録完了しました");
			setLoading(false);
		}
	};

	//新しい月を作成する
	//月をselect用の配列を用意
	const monthArray = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
	const initialYearMonthData = {
		year_month: "",
		shop_name: "塩山店"
	};

	const [yearMonth, setYearMonth] = useState<yearMonth>(initialYearMonthData);
	console.log(yearMonth);
	//selectするごとにyearMonthに値をセット
	const newYear = useSelectOnChange();
	const newMonth = useSelectOnChange();
	const newYearMonth = `${newYear.value}/${newMonth.value}`;

	useEffect(() => {
		setYearMonth({ ...yearMonth, year_month: newYearMonth });
	}, [newYearMonth]);

	const onMaking = async () => {
		const { error } = await supabase.from("year_month").insert(yearMonth);
		setYearMonthArray([...yearMonthArray, yearMonth]);
		toast.success("新しい年月を追加しました");
		if (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<Box m={4}>
				<Stack>
					<Text fontSize={"lg"} fontWeight="bold">
						実績入力フォーム
					</Text>
					<Divider />

					<Text fontSize={"lg"} fontWeight={"bold"}>
						実績日を選択
					</Text>
					<Stack p={2}>
						<CustomDatePickerCalendar />

						<Select onChange={selectShopName.onChangeSelect} placeholder="店舗を選択" backgroundColor={"white"}>
							{shopNameList.map((item) => {
								return (
									<option key={item} value={item}>
										{item}
									</option>
								);
							})}
						</Select>
					</Stack>
					<Wrap>
						{inputItemsArray.map((item, Index) => {
							const label = itemLabel[Index];
							return (
								<WrapItem>
									<InputItemsCard itemLabel={label} inputItem={item} loading={loading} />
								</WrapItem>
							);
						})}
					</Wrap>

					<Box>
						<Button
							onClick={onSubmit}
							colorScheme="teal"
							isDisabled={loading || selectShopName.value === ""}
							isLoading={loading}
						>
							送信
						</Button>
					</Box>
					<Stack>
						<Divider />
						<Text fontSize={"lg"} fontWeight="bold">
							新しい月を作成する
						</Text>

						<Select onChange={newYear.onChangeSelect} placeholder="新しい年を選択" backgroundColor={"white"}>
							<option value="2022">2022年</option>
						</Select>
						<Select onChange={newMonth.onChangeSelect} placeholder="新しい月を選択" backgroundColor={"white"}>
							{monthArray.map((item) => {
								return (
									<option key={item} value={item}>
										{item}月
									</option>
								);
							})}
						</Select>
						<Box>
							<Button onClick={onMaking} colorScheme="teal" isDisabled={newYear.value === "" || newMonth.value === ""}>
								作成
							</Button>
						</Box>
					</Stack>
				</Stack>
			</Box>
		</>
	);
};

export const getStaticProps = async () => {
	const { data: year_month, error: year_monthError } = await supabase.from("year_month").select("*");
	if (year_monthError) {
		console.log(year_monthError.message);
	}
	const { data: achievements, error: achievementsError } = await supabase.from("achievements").select("*");
	if (achievementsError) {
		console.log(achievementsError.message);
	}
	return { props: { year_month, achievements }, revalidate: 60 };
};
export default Index;
