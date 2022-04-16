import { Divider, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";
import { goal } from "../pages/goal_setting";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Props = {
	label: string;
	total: number;
	goal: goal;
};

export const ProgressCard = memo((props: Props) => {
	const { label, total, goal } = props;

	console.log(label);
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
	console.log(progressCardContent);

	return (
		<>
			{progressCardContent ? (
				<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
					<Text fontSize={"lg"} fontWeight="bold">
						目標{label}
					</Text>
					<Divider borderColor={"blue.500"} />
					<Text fontSize={"x-large"} fontWeight={"bold"}>
						目標値{progressCardContent.goal}
					</Text>
					<Text fontSize={"x-large"} fontWeight={"bold"}>
						現在の実績{total}
					</Text>
					<Text fontSize={"x-large"} fontWeight={"bold"}>
						残り{progressCardContent.remaining} 件
					</Text>
					<CircularProgressbar
						value={progressCardContent.rateOfProgress}
						maxValue={1}
						text={`${new Intl.NumberFormat("ja", { style: "percent", maximumSignificantDigits: 3 }).format(
							progressCardContent.rateOfProgress
						)}`}
					/>
					;
				</Stack>
			) : undefined}
		</>
	);
});
