import { Select, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Box, Stack, Text } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { yearMonth } from ".";
import { useSelectOnChange } from "../components/useSelectOnChange";
import { achievementsArray } from "../globalState/achievementsArray";
import { onSelectedShopName } from "../globalState/onSelectedShopName";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";
import { showAchievementsTableArray } from "../globalState/selector/showAchievementsTabeleArray";
import { shopNameArray } from "../globalState/shopNameArray";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const ViewTable = ({ achievements, year_month }) => {
	//年月とショップ名をDBから取得ものを配列
	const yearMonthArray: yearMonth[] = [...year_month];

	//登録済みの年月のみの配列を生成。後ほどincludeとしてfilterで使用
	const setSelectYearMonth = useSetRecoilState(selectOptionYearMonth);
	useEffect(() => {
		const selectYearMonthList = yearMonthArray.map((item) => {
			return item.year_month;
		});
		setSelectYearMonth(selectYearMonthList);
	}, [yearMonthArray]); //yearMonthが更新されるたびに更新

	//実績データの取得とglobalStateへの登録
	const setAchievements = useSetRecoilState(achievementsArray);
	useEffect(() => {
		setAchievements(achievements);
	}, []);
	//作成された年月をselectのopとして利用
	const selectOption = useRecoilValue(selectOptionYearMonth);
	//選択されている年月用のstate
	const setSelectedYearMonth = useSetRecoilState(onSelectYearMonthState);

	const selectYearMonth = useSelectOnChange();
	useEffect(() => {
		setSelectedYearMonth(selectYearMonth.value);
	}, [selectYearMonth.value]);

	//店舗selectのopとして利用
	const selectOptionShopName = useRecoilValue(shopNameArray);
	//選択されている店舗用state
	const setOnSelectShopName = useSetRecoilState(onSelectedShopName);
	const selectShopName = useSelectOnChange();
	useEffect(() => {
		setOnSelectShopName(selectShopName.value);
	}, [selectShopName.value]);

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
					placeholder={"月を選択"}
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
				実施日別実績テーブル
			</Text>
			<Box overflowX="scroll">
				<Table variant="simple">
					<TableCaption>月別実績一覧テーブル</TableCaption>
					<Thead>
						<Tr>
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
									<Td>{item.date_of_results}</Td>
									<Td>{item.seminar_count}</Td>
									<Td>{item.u_usercount}</Td>
									<Td>{item.new_usercount}</Td>
									<Td>{item.mx_seminar_count}</Td>
									<Td>{item.mx_usercount}</Td>
									<Td>{item.shop_name}</Td>
									<Td>{item.created_at}</Td>
								</Tr>
							);
						})}
					</Tbody>
					<Tfoot>
						<Tr>
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
	return { props: { achievements, year_month } };
};

export default ViewTable;
