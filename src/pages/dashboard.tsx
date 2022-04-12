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
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";
import { DashBoardCard } from "../components/DashBoardCard";
import { TotalFeeCard } from "../components/TotalFeeCard";
import { useUser } from "@auth0/nextjs-auth0";
import { format } from "date-fns";
import { DeleteRowModal } from "../components/DeleteRowModal";
import { EditRowModal } from "../components/EditRowModal";
import { TotalIncomeCard } from "../components/TotalIncomeCard";
import { useRouter } from "next/router";
import { useYearMonthDataSet } from "../hooks/useYearMonthDataSet";
import { useAchievementDataSet } from "../hooks/useAchievementDataSet";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DashBoard = ({ achievements, year_month }) => {
	const router = useRouter();
	const { user } = useUser();
	if (!user) {
		typeof window === "undefined" ? undefined : router.replace("/api/auth/login");
	}

	//テーブルの表示非表示Flag
	const [isShowTable, setIsShowTable] = useState<boolean>(false);

	const { selectOption, selectShopName, selectYearMonth, shopNameList } = useYearMonthDataSet({ year_month });

	const { totalAchievements, showAchievements } = useAchievementDataSet({ achievements });

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
					<br />
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
					<Button colorScheme={"facebook"} onClick={() => setIsShowTable(!isShowTable)} m={4}>
						{isShowTable ? "実績テーブルを非表示" : "実績テーブルを表示"}
					</Button>

					{isShowTable && (
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
											<Th>ユニークユーザー数</Th>
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

//export const getServerSideProps = withPageAuthRequired();

export default DashBoard;
