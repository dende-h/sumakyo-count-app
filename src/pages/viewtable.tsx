import { Select, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, Box } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";
import { showAchievementsTableArray } from "../globalState/selector/showAchievementsTabeleArray";

const ViewTable = () => {
	const selectOption = useRecoilValue(selectOptionYearMonth);
	const [selectYearMonth, setSelectYearMonth] = useRecoilState(onSelectYearMonthState);

	const onSelectYearMonth: ChangeEventHandler<HTMLSelectElement> = (e) => {
		setSelectYearMonth(e.target.value);
	};

	const showAchievements = useRecoilValue(showAchievementsTableArray);
	console.log(showAchievements);

	return (
		<>
			<Select onChange={onSelectYearMonth} defaultValue={selectYearMonth}>
				{selectOption.map((item) => {
					return (
						<option key={item} value={`${item}`}>
							{item}
						</option>
					);
				})}
			</Select>
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
							<Th>入力日</Th>
						</Tr>
					</Tfoot>
				</Table>
			</Box>
		</>
	);
};
export default ViewTable;
