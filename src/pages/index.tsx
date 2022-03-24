import { Box, Button, Divider, Input, Select, Stack, Text } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useCountUpDown } from "../components/useCountUpDown";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dateState } from "../globalState/dateState";
import { useSelectOnChange } from "../components/useSelectOnChange";
import { achievementState } from "../globalState/achievementState";
import { achievementsArray } from "../globalState/achievementsArray";

type yearMonth = {
	id?: number;
	created_at?: string;
	year_month: string;
	user_id?: string;
	shop_name: string;
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
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Index = ({ year_month, achievements }) => {
	//実績データの取得とglobalStateへの登録
	const setAchievements = useSetRecoilState(achievementsArray);
	useEffect(() => {
		setAchievements(achievements);
	}, [achievements]);
	console.log(achievements);
	//年月とショップ名をDBから取得
	const YearMonthArray: yearMonth[] = [...year_month];

	//登録済みの年月のみの配列を取得。後ほどincludeとしてfilterで使用
	const selectYearMonthList = YearMonthArray.map((item) => {
		return item.year_month;
	});

	//ショップ名を取得
	const shopNameList = YearMonthArray.map((item) => {
		return item.shop_name;
	});
	const shopName = shopNameList[0]; //塩山店

	//datepickerで選択した日付（文字列型）
	const inputDate = useRecoilValue(dateState);

	//それぞれの実績入力データ（カウントアップダウン）（数値型）
	const seminarCount = useCountUpDown();
	const uniqueUserCount = useCountUpDown();
	const newUserCount = useCountUpDown();
	const mxSeminarCount = useCountUpDown();
	const mxUserCount = useCountUpDown();

	//データを書き込むためのオブジェクト定義
	const [achievement, setAchievement] = useRecoilState(achievementState);

	//送信ボタンを押したときのinsartAPI
	const onSubmit = async () => {
		setAchievement({
			...achievement,
			u_usercount: uniqueUserCount.count,
			new_usercount: newUserCount.count,
			seminar_count: seminarCount.count,
			mx_seminar_count: mxSeminarCount.count,
			mx_usercount: mxUserCount.count,
			date_of_results: inputDate
		});

		const { error } = await supabase.from("achievements").insert(achievement);
		//カウントデータの初期化
		seminarCount.setCount(0);
		uniqueUserCount.setCount(0);
		newUserCount.setCount(0);
		mxSeminarCount.setCount(0);
		mxUserCount.setCount(0);
		if (error) {
			//エラー時のコンソール表示
			console.log(error);
		}
	};

	//新しい月を作成する
	const monthArray = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
	const initialYearMonthDate = {
		year_month: "",
		shop_name: "塩山店"
	};

	const [yearMonth, setYearMonth] = useState<yearMonth>(initialYearMonthDate);
	//selectするごとにyearMonthに値をセット
	const newYear = useSelectOnChange();
	const newMonth = useSelectOnChange();
	const newYearMonth = `${newYear.value}/${newMonth.value}`;
	useEffect(() => {
		setYearMonth({ ...yearMonth, year_month: newYearMonth });
	}, [newYearMonth]);

	const onMaking = async () => {
		const { error } = await supabase.from("year_month").insert(yearMonth);
		setYearMonth(initialYearMonthDate);
		if (error) {
			console.log(error.message);
		}
	};

	return (
		<>
			<Box>
				<Stack>
					<Text>新しい月を作成する</Text>
					<Select onChange={newYear.onChangeSelect} placeholder="新しい年を選択">
						<option value="2022">2022年</option>
					</Select>
					<Select onChange={newMonth.onChangeSelect} placeholder="新しい月を選択">
						{monthArray.map((item) => {
							return (
								<option key={item} value={item}>
									{item}月
								</option>
							);
						})}
					</Select>

					<Box>
						<Button onClick={onMaking}>作成</Button>
					</Box>
					<Text>{`${shopName}スマホ教室実績入力フォーム`}</Text>
					<Divider />
					<Box>
						<CustomDatePickerCalendar />
					</Box>
					<Box>
						<Text>講座開催数</Text>
						<Text>{seminarCount.count}</Text>
						<Button onClick={seminarCount.upButtonClick}>Up</Button>
						<Button onClick={seminarCount.downButtonClick}>down</Button>
					</Box>
					<Box>
						<Text>ユニークユーザー数</Text>
						<Text>{uniqueUserCount.count}</Text>
						<Button onClick={uniqueUserCount.upButtonClick}>Up</Button>
						<Button onClick={uniqueUserCount.downButtonClick}>down</Button>
					</Box>
					<Box>
						<Text>新規ユーザー数</Text>
						<Text>{newUserCount.count}</Text>
						<Button onClick={newUserCount.upButtonClick}>Up</Button>
						<Button onClick={newUserCount.downButtonClick}>down</Button>
					</Box>
					<Box>
						<Text>MX講座開催数</Text>
						<Text>{mxSeminarCount.count}</Text>
						<Button onClick={mxSeminarCount.upButtonClick}>Up</Button>
						<Button onClick={mxSeminarCount.downButtonClick}>down</Button>
					</Box>
					<Box>
						<Text>MX講座ユーザー数</Text>
						<Text>{mxUserCount.count}</Text>
						<Button onClick={mxUserCount.upButtonClick}>Up</Button>
						<Button onClick={mxUserCount.downButtonClick}>down</Button>
					</Box>
					<Box>
						<Button onClick={onSubmit}>送信</Button>
					</Box>
				</Stack>
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
	return { props: { year_month, achievements } };
};
export default Index;
