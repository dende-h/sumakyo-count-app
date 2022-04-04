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
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { yearMonth } from ".";
import { DashBoardCard } from "../components/DashBoardCard";
import { useSelectOnChange } from "../hooks/useSelectOnChange";
import { achievementsArray } from "../globalState/achievementsArray";
import { onSelectedShopName } from "../globalState/onSelectedShopName";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";
import { achievementTotalArray } from "../globalState/selector/achievementTotalArray";
import { shopNameArray } from "../globalState/shopNameArray";
import { showAchievementsTableArray } from "../globalState/selector/showAchievementsTabeleArray";
import { TotalFeeCard } from "../components/TotalFeeCard";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { format } from "date-fns";
import { DeleteRowModal } from "../components/DeleteRowModal";
import { EditRowModal } from "../components/EditRowModal";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DashBoard = ({ achievements, year_month }) => {
	//テーブルの表示非表示Flag
	const [isShowTable, setIsShowTable] = useState<boolean>(false);

	//年月とショップ名をDBから取得ものを配列のStateとして保持
	const yearMonthArray: yearMonth[] = [...year_month];

	//登録済みの年月のみの配列を生成。後ほどincludeとしてfilterで使用
	const setSelectYearMonth = useSetRecoilState(selectOptionYearMonth);
	useEffect(() => {
		const selectYearMonthList = yearMonthArray.map((item) => {
			return item.year_month;
		});
		setSelectYearMonth(selectYearMonthList);
	}, []); //yearMonthが更新されるたびに更新

	//実績データの取得とglobalStateへの登録
	const setAchievements = useSetRecoilState(achievementsArray);
	useEffect(() => {
		setAchievements(achievements);
	}, []);
	//作成された年月をselectのopとして利用
	const selectOption = useRecoilValue(selectOptionYearMonth);
	//選択されている年月用のstateSet
	const setSelectedYearMonth = useSetRecoilState(onSelectYearMonthState);

	const selectYearMonth = useSelectOnChange();
	useEffect(() => {
		setSelectedYearMonth(selectYearMonth.value);
	}, [selectYearMonth.value]);

	//店舗selectのopとして利用
	const selectOptionShopName = useRecoilValue(shopNameArray);
	//選択されている店舗用stateSet
	const setOnSelectShopName = useSetRecoilState(onSelectedShopName);
	const selectShopName = useSelectOnChange();
	useEffect(() => {
		setOnSelectShopName(selectShopName.value);
	}, [selectShopName.value]);

	const totalAchievements = useRecoilValue(achievementTotalArray);

	//表示する実績のselector、年月と店舗の選択によってfilterされる
	const showAchievements = useRecoilValue(showAchievementsTableArray);

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
					{selectOptionShopName.map((item) => {
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
				</Wrap>
			</Box>
			<Button colorScheme={"facebook"} onClick={() => setIsShowTable(!isShowTable)} m={4}>
				{isShowTable ? "実績テーブルを非表示" : "実績テーブルを表示"}
			</Button>

			{isShowTable && (
				<Box m={6} overflowX="scroll">
					<Text fontSize={"lg"} fontWeight={"bold"} marginLeft={4}>
						日別実績
					</Text>
					<Box w={"1200px"}>
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
									<Th>ユニークユーザー数</Th>
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
	);
};
export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps() {
		const { data: year_month, error: year_monthError } = await supabase.from("year_month").select("*");
		if (year_monthError) {
		}
		const { data: achievements, error: achievementsError } = await supabase.from("achievements").select("*");
		if (achievementsError) {
		}
		return { props: { year_month, achievements } };
	}
});

export default DashBoard;
