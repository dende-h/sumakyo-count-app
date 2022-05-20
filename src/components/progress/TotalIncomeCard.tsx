import { Divider, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";
import { useRecoilValue } from "recoil";
import { achievementTotalArray } from "../../globalState/selector/achievementTotalArray";

export const TotalIncomeCard = memo(() => {
	//ユニークユーザーと新規ユーザーの手数料の金額定義
	const uniqueUserFee = 1100;
	const newUserFee = 2200;

	const totalAchievements = useRecoilValue(achievementTotalArray);
	//リピートユーザーと新規ユーザーの手数料の計算を手数料配列とする
	const participantArray = totalAchievements
		.filter((item) => {
			return item.label === "リピートユーザー数" || item.label === "新規ユーザー数";
		})
		.map((item) => {
			const totalIncome = () => {
				if (item.label === "リピートユーザー数") {
					const uniqueUserIncome = item.total * uniqueUserFee;
					return uniqueUserIncome;
				}
				if (item.label) {
					const newUserIncome = item.total * newUserFee;
					return newUserIncome;
				}
			};
			return totalIncome();
		});

	// 手数料配列の合計
	const totalIncome = participantArray.reduce((sum, element) => {
		return sum + element;
	}, 0);

	return (
		<>
			<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
				<Text fontSize={"lg"} fontWeight="bold">
					手数料合計見込み
				</Text>
				<Divider borderColor={"blue.500"} />
				<Text fontSize={"x-large"} fontWeight={"bold"}>
					{`現在${totalIncome}円`}
				</Text>
			</Stack>
		</>
	);
});
