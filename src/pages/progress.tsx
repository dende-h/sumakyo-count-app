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
	WrapItem,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverHeader,
	PopoverBody,
	PopoverFooter,
	PopoverArrow,
	PopoverCloseButton,
	PopoverAnchor
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
import { EditGoalRowModal } from "../components/EditGoalRowModal";
import { DeleteGoalsRowModal } from "../components/DeleteGoalsRowModal";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { EditRowModal } from "../components/EditRowModal";
import { DeleteRowModal } from "../components/DeleteRowModal";
import { format } from "date-fns";
import { DashBoardCard } from "../components/DashBoardCard";
import { TotalIncomeCard } from "../components/TotalIncomeCard";
import { TotalFeeCard } from "../components/TotalFeeCard";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const Progress = ({ year_month, achievements, goalValue }) => {
	const { selectOption, selectShopName, selectYearMonth, shopNameList } = useYearMonthDataSet({
		year_month
	});

	const { totalAchievements, showAchievements } = useAchievementDataSet({ achievements });

	const router = useRouter();
	const { user } = useUser();
	if (!user) {
		typeof window === "undefined" ? undefined : router.replace("/api/auth/login");
	}

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
	const [isShowAchievementsTable, setIsShowAchievementsTable] = useState<boolean>(false);

	//テーブル表示非表示の入れ替えロジックの関数
	const isShowTableButtonClick = () => {
		setIsShowTable(!isShowTable);
		setIsShowAchievementsTable(false);
	};
	const isShowAchievementsTableButtonClick = () => {
		setIsShowAchievementsTable(!isShowAchievementsTable);
		setIsShowTable(false);
	};

	//日報の日付変更のPopoverの表示非表示のstate
	const [isOpenPopover, setIsOpenPopover] = useState(false);

	return (
		<>
			{user ? (
				<>
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
						店舗と年月を選択
					</Text>
					<Stack p={2}>
						<Select
							onChange={selectYearMonth.onChangeSelect}
							placeholder={"年月を選択"}
							defaultValue={onSelectYearMonth}
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
							defaultValue={onSelectShopName}
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
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
						{selectedDate}の日報
						<Popover
							onOpen={() => setIsOpenPopover(true)}
							onClose={() => {
								setIsOpenPopover(false);
							}}
						>
							<PopoverTrigger>
								<Button marginX={3} size={"sm"} colorScheme={isOpenPopover ? "orange" : "facebook"}>
									日付変更
								</Button>
							</PopoverTrigger>
							<PopoverContent>
								<PopoverArrow />
								<PopoverCloseButton />
								<PopoverHeader>対象の日付を選んで下さい</PopoverHeader>
								<PopoverBody textAlign={"center"}>
									<Box backgroundColor={"gray.100"} h={10} p={2}>
										<CustomDatePickerCalendar />
									</Box>
								</PopoverBody>
							</PopoverContent>
						</Popover>
					</Text>
					<Wrap p={"4"}>
						{achievementArray.length === 0 && (
							<WrapItem>
								<Text>表示対象がありません</Text>
							</WrapItem>
						)}
						{onSelectShopName !== "全店舗" ? (
							achievementArray.map((item) => {
								return <DailyCard key={item.id} achievement={item} />;
							})
						) : (
							<WrapItem>
								<Text>全店舗は日別実績表示対象外</Text>
							</WrapItem>
						)}
					</Wrap>
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4}>
						TOTAL実績
					</Text>
					<Box>
						<Wrap p={"4"}>
							{totalAchievements.map((item) => {
								return (
									<WrapItem key={item.label}>
										<DashBoardCard label={item.label} total={item.total} />
									</WrapItem>
								);
							})}
						</Wrap>
					</Box>
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4} marginTop={4}>
						進捗率と目標までの残数
					</Text>
					<Wrap p={"4"}>
						{selectedGoalValueObject ? (
							totalAchievements.map((item) => {
								return (
									<WrapItem key={item.label}>
										<ProgressCard label={item.label} total={item.total} goal={selectedGoalValueObject} />
									</WrapItem>
								);
							})
						) : (
							<WrapItem>
								<Text>表示対象がありません</Text>
							</WrapItem>
						)}
					</Wrap>
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4}>
						手数料見込み
					</Text>
					<Box>
						<Wrap p={"4"} marginLeft={-2}>
							{totalAchievements.map((item) => {
								return (
									<WrapItem key={item.label}>
										<TotalFeeCard label={item.label} total={item.total} />
									</WrapItem>
								);
							})}
							<WrapItem>
								<TotalIncomeCard />
							</WrapItem>
						</Wrap>
					</Box>
					<Button colorScheme={isShowTable ? "orange" : "facebook"} onClick={isShowTableButtonClick} m={4}>
						{isShowTable ? "目標値テーブルを非表示" : "目標値テーブルを表示"}
					</Button>
					<Button
						colorScheme={isShowAchievementsTable ? "orange" : "facebook"}
						onClick={isShowAchievementsTableButtonClick}
						m={4}
					>
						{isShowAchievementsTable ? "実績テーブルを非表示" : "実績テーブルを表示"}
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
															<EditGoalRowModal editItem={item} />
															<DeleteGoalsRowModal id={item.id} />
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

					{isShowAchievementsTable && (
						<Box marginLeft={6} overflowX="scroll">
							<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4}>
								日別実績
							</Text>
							<Box w={"1200px"} h={"400px"}>
								<Table variant="striped" colorScheme="teal" size={"sm"}>
									<TableCaption>月別実績一覧テーブル</TableCaption>
									<Thead>
										<Tr>
											<Th></Th>
											<Th>実績日</Th>
											<Th>講座開催数</Th>
											<Th>リピートユーザー数</Th>
											<Th>新規ユーザー数</Th>
											<Th>MX講座開催数</Th>
											<Th>MX講座ユーザー数</Th>
											<Th>店舗</Th>
											<Th>入力日</Th>
										</Tr>
									</Thead>
									<Tbody>
										{showAchievements.map((item) => {
											return (
												<Tr key={item.id}>
													<Td>
														<HStack>
															<EditRowModal editItem={item} />
															<DeleteRowModal id={item.id} />
														</HStack>
													</Td>
													<Td>{item.date_of_results}</Td>
													<Td>{item.seminar_count}開催</Td>
													<Td>{item.u_usercount}人</Td>
													<Td>{item.new_usercount}人</Td>
													<Td>{item.mx_seminar_count}開催</Td>
													<Td>{item.mx_usercount}人</Td>
													<Td>{item.shop_name}</Td>
													<Td>{format(new Date(item.created_at), "yyyy/MM/dd")}</Td>
												</Tr>
											);
										})}
									</Tbody>
									<Tfoot>
										<Tr>
											<Th></Th>
											<Th>実績日</Th>
											<Th>講座開催数</Th>
											<Th>リピートユーザー数</Th>
											<Th>新規ユーザー数</Th>
											<Th>MX講座開催数</Th>
											<Th>MX講座ユーザー数</Th>
											<Th>店舗</Th>
											<Th>入力日</Th>
										</Tr>
									</Tfoot>
								</Table>
							</Box>
						</Box>
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

export const getServerSideProps = async () => {
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
	return { props: { year_month, achievements, goalValue } };
};

export default Progress;
