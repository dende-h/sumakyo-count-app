import { Box, Button, Divider, Input, Select, Stack, Text } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import format from "date-fns/format";
import { useCountUpDown } from "../components/useCountUpDown";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";
import { useRecoilValue } from "recoil";
import { dateState } from "../globalState/dateState";

type yearMonth = {
	id?: number;
	created_at?: string;
	year_month: string;
	user_id?: string;
	shop_name: string;
};

type userCount = {
	id?: number;
	created_at?: string;
	u_usercount: number;
	new_usercount: number;
	seminar_count: number;
	mx_seminar_count: number;
	mx_usercount: number;
	user_id?: number;
	year_month_id?: number;
};

const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Index = ({ year_month }) => {
	const YearMonth: yearMonth[] = [...year_month];
	console.log(YearMonth);

	const selectYearMonthList = YearMonth.map((item) => {
		return item.year_month;
	});

	const shopNameList = YearMonth.map((item) => {
		return item.shop_name;
	});
	console.log(shopNameList);
	const shopName = shopNameList[0];

	const [achievement, setAchievement] = useState<userCount>();
	const inputDate = useRecoilValue(dateState);
	const seminarCount = useCountUpDown();
	const uniqueUserCount = useCountUpDown();
	const newUserCount = useCountUpDown();
	const mxSeminarCount = useCountUpDown();
	const mxUserCount = useCountUpDown();
	console.log(inputDate);

	const onSubmit = async () => {
		setAchievement({
			...achievement,
			u_usercount: uniqueUserCount.count,
			new_usercount: newUserCount.count,
			seminar_count: seminarCount.count,
			mx_seminar_count: mxSeminarCount.count,
			mx_usercount: mxUserCount.count
		});
		console.log(achievement);
		await supabase.from("achievements").insert(achievement);
	};

	return (
		<>
			<Box>
				<Stack>
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
	const { data: year_month, error } = await supabase.from("year_month").select("*");
	return { props: { year_month } };
};
export default Index;
