import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useYearMonthDataSet } from "../hooks/useYearMonthDataSet";
import { useAchievementDataSet } from "../hooks/useAchievementDataSet";
import {
	Box,
	Button,
	HStack,
	Select,
	Stack,
	Table,
	TableCaption,
	Tbody,
	Td,
	Text,
	Tfoot,
	Th,
	Thead,
	Tr,
	Wrap,
	WrapItem
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { goalValueState } from "../globalState/goalValueState";
import { dateState } from "../globalState/dateState";
import { useEffect, useState } from "react";
import { ProgressCard } from "../components/ProgressCard";
import { onSelectedShopName } from "../globalState/onSelectedShopName";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { dateOfAchievement } from "../globalState/selector/dateOfAchievement";
import { DailyCard } from "../components/DailyCard";
import { DeleteRowModal } from "../components/DeleteRowModal";
import { EditRowModal } from "../components/EditRowModal";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Progress = ({ year_month, achievements, goalValue }) => {
	const { inputShopName, selectOption, selectShopName, selectYearMonth } = useYearMonthDataSet({
		year_month
	});

	const { totalAchievements } = useAchievementDataSet({ achievements });

	//取得目標値の配列をセット
	const [goal, setGoal] = useRecoilState(goalValueState);

	useEffect(() => {
		setGoal(goalValue);
	}, []);

	//選択した日付をRecoilから取得
	const selectedDate = useRecoilValue(dateState);
	const achievementArray = useRecoilValue(dateOfAchievement);

	const onSelectShopName = useRecoilValue(onSelectedShopName);
	const onSelectYearMonth = useRecoilValue(onSelectYearMonthState);

	//選択された店舗と年月で目標をfilter
	const selectedGoalValueArray = goal.filter((item) => {
		return item.shop_name_month.includes(onSelectShopName) && item.shop_name_month.includes(onSelectYearMonth);
	});

	//オブジェクトに変換
	const selectedGoalValueObjectArray = { ...selectedGoalValueArray };
	const selectedGoalValueObject = selectedGoalValueObjectArray[0];

	//テーブルの表示非表示Flag
	const [isShowTable, setIsShowTable] = useState<boolean>(false);

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
					{inputShopName.map((item) => {
						return (
							<option key={item} value={`${item}`}>
								{item}
							</option>
						);
					})}
				</Select>
			</Stack>
			<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
				{selectedDate}の日報
			</Text>
			<Wrap p={"4"}>
				{achievementArray.map((item) => {
					return <DailyCard key={item.id} achievement={item} />;
				})}
			</Wrap>
			<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
				進捗率と目標までの残数
			</Text>
			<Wrap p={"4"}>
				{totalAchievements.map((item) => {
					return (
						<WrapItem key={item.label}>
							<ProgressCard label={item.label} total={item.total} goal={selectedGoalValueObject} />
						</WrapItem>
					);
				})}
			</Wrap>
			<Button colorScheme={"facebook"} onClick={() => setIsShowTable(!isShowTable)} m={4}>
				{isShowTable ? "目標値テーブルを非表示" : "目標値テーブルを表示"}
			</Button>

			{isShowTable && (
				<Box marginLeft={6} overflowX="scroll">
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4}>
						月別目標値
					</Text>
					<Box w={"1200px"} h={"400px"}>
						<Table variant="striped" colorScheme="teal" size={"sm"}>
							<TableCaption>月別目標値テーブル</TableCaption>
							<Thead>
								<Tr>
									<Th></Th>
									<Th>講座開催数</Th>
									<Th>リピートユーザー数</Th>
									<Th>新規ユーザー数</Th>
									<Th>MX講座開催数</Th>
									<Th>MX講座ユーザー数</Th>
									<Th>店舗/年月</Th>
								</Tr>
							</Thead>
							<Tbody>
								{goal.map((item) => {
									return (
										<Tr key={item.id}>
											<Td>
												<HStack>
													<EditRowModal editItem={item} />
													<DeleteRowModal id={item.id} />
												</HStack>
											</Td>
											<Td>{item.seminar_goal}開催</Td>
											<Td>{item.u_user_goal}人</Td>
											<Td>{item.new_user_goal}人</Td>
											<Td>{item.mx_seminar_goal}開催</Td>
											<Td>{item.mx_seminar_goal}人</Td>
											<Td>{item.shop_name_month}</Td>
										</Tr>
									);
								})}
							</Tbody>
							<Tfoot>
								<Tr>
									<Th></Th>
									<Th>講座開催数</Th>
									<Th>リピートユーザー数</Th>
									<Th>新規ユーザー数</Th>
									<Th>MX講座開催数</Th>
									<Th>MX講座ユーザー数</Th>
									<Th>店舗/年月</Th>
								</Tr>
							</Tfoot>
						</Table>
					</Box>
				</Box>
			)}
		</>
	);
};

export const getServerSideProps = async () => {
	const { data: year_month, error: year_monthError } = await supabase.from("year_month").select("*");
	if (year_monthError) {
	}
	const { data: achievements, error: achievementsError } = await supabase.from("achievements").select("*");
	if (achievementsError) {
	}
	const { data: goalValue, error: goalValueError } = await supabase.from("goal_value").select("*");

	if (goalValueError) {
	}
	return { props: { year_month, achievements, goalValue } };
};

export default Progress;
