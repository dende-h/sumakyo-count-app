import { Divider, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
	label: string;
	total: number;
};

export const TotalFeeCard = memo((props: Props) => {
	const { label, total } = props;
	//ユニークユーザーと新規ユーザーの手数料の金額定義
	const uniqueUserFee = 1000;
	const newUserFee = 2000;

	const totalFeeCalc = () => {
		switch (label) {
			case "ユニークユーザー数":
				const totalUniqueUserFee = total * uniqueUserFee;
				const uuFeeLabel = "ユニークユーザー手数料";
				return { totalUniqueUserFee, uuFeeLabel };
			case "新規ユーザー数":
				const totalNewUserFee = total * newUserFee;
				const nuFeeLabel = "新規ユーザー手数料";
				return { totalNewUserFee, nuFeeLabel };
			default:
				return null;
		}
	};

	const totalFee = totalFeeCalc();

	return (
		<>
			{totalFee === null ? undefined : (
				<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
					<Text fontSize={"lg"} fontWeight="bold">
						{totalFee.uuFeeLabel || totalFee.nuFeeLabel}
					</Text>
					<Divider />
					<Text fontSize={"x-large"} fontWeight={"bold"}>
						{totalFee.uuFeeLabel && `現在${totalFee.totalUniqueUserFee}円`}
						{totalFee.nuFeeLabel && `現在${totalFee.totalNewUserFee}円`}
					</Text>
				</Stack>
			)}
		</>
	);
});
