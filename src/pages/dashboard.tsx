import { Box, Button, Center, Divider, Select, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { ChangeEventHandler } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DashBoardCard } from "../components/DashBoardCard";
import { onSelectYearMonthState } from "../globalState/onSelectYearMonthState";
import { selectOptionYearMonth } from "../globalState/selectOptionYearMonth";
import { achievementTotal } from "../globalState/selector/achievementTotalArray";

const DashBoard = () => {
	const selectOption = useRecoilValue(selectOptionYearMonth);
	const [selectYearMonth, setSelectYearMonth] = useRecoilState(onSelectYearMonthState);

	const onSelectYearMonth: ChangeEventHandler<HTMLSelectElement> = (e) => {
		setSelectYearMonth(e.target.value);
	};

	const totalAchievements = useRecoilValue(achievementTotal);
	console.log(totalAchievements);

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
			<Box>
				<Center>
					<Wrap p={"4"}>
						{totalAchievements.map((item) => {
							return (
								<WrapItem _hover={{ cursor: "pointer" }}>
									<DashBoardCard key={item.label} label={item.label} total={item.total} />
								</WrapItem>
							);
						})}
					</Wrap>
				</Center>
			</Box>
		</>
	);
};
export default DashBoard;
