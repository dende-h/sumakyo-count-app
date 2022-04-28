import { Divider, Stack, Text, Box, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { goal } from "../pages/goal_setting";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
	label: string;
	total: number;
	goal?: goal;
};

export const ProgressCard = memo((props: Props) => {
	const { label, total, goal } = props;

	//goalがundefinedの場合は計算されない
	const progressCardContentCalc = () => {
		if (goal) {
			const progressCalc = () => {
				switch (label) {
					case "講座開催数":
						//残り件数
						const remainingSeminar = goal.seminar_goal - total;
						//進捗率
						const rateOfProgressSeminar = total / goal.seminar_goal;

						return { goal: goal.seminar_goal, remaining: remainingSeminar, rateOfProgress: rateOfProgressSeminar };
					case "リピートユーザー数":
						//残り件数
						const remainingUniqueUser = goal.u_user_goal - total;
						//進捗率
						const rateOfProgressUniqueUser = total / goal.u_user_goal;

						return { goal: goal.u_user_goal, remaining: remainingUniqueUser, rateOfProgress: rateOfProgressUniqueUser };
					case "新規ユーザー数":
						//残り件数
						const remainingNewUser = goal.new_user_goal - total;
						//進捗率
						const rateOfProgressNewUser = total / goal.new_user_goal;

						return { goal: goal.new_user_goal, remaining: remainingNewUser, rateOfProgress: rateOfProgressNewUser };
					default:
						return null;
				}
			};
			const progressCardContent = progressCalc();

			return progressCardContent;
		}
	};
	const progressCardContent = progressCardContentCalc();

	return (
		<>
			{progressCardContent ? (
				<Flex backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
					<Stack p={4} w={["180px", "220px", "260px"]}>
						<Text fontSize={["md", "lg", "lg"]} fontWeight="bold">
							目標{label}
						</Text>
						<Divider borderColor={"blue.500"} />
						<Text fontSize={["md", "lg", "x-large"]} fontWeight={"bold"}>
							目標数{progressCardContent.goal}
							{label === "講座開催数" ? "回" : "人"}
						</Text>
						<Text fontSize={["md", "lg", "x-large"]} fontWeight={"bold"}>
							残り{progressCardContent.remaining}
							{label === "講座開催数" ? "回" : "人"}
						</Text>
					</Stack>
					<Box paddingX={2} paddingY={4} w={["110px", "130px", "150px"]}>
						<CircularProgressbar
							value={progressCardContent.rateOfProgress}
							maxValue={1}
							text={`${new Intl.NumberFormat("ja", { style: "percent", maximumSignificantDigits: 3 }).format(
								progressCardContent.rateOfProgress
							)}`}
						/>
					</Box>
				</Flex>
			) : undefined}
		</>
	);
});
