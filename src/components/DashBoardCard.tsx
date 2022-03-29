import { Divider, Stack, Text } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
	label: string;
	total: number;
};

export const DashBoardCard = memo((props: Props) => {
	const { label, total } = props;

	return (
		<>
			<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
				<Text fontSize={"lg"} fontWeight="bold">
					{label}
				</Text>
				<Divider />
				<Text fontSize={"x-large"} fontWeight={"bold"}>
					{total}
					{label === "講座開催数" || label === "MX講座開催数" ? "回" : "人"}
				</Text>
			</Stack>
		</>
	);
});
