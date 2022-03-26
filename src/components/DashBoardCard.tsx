import { Box, Divider, Stack, Text } from "@chakra-ui/react";

type Props = {
	label: string;
	total: number;
};

export const DashBoardCard = (props: Props) => {
	const { label, total } = props;

	return (
		<Box p={2}>
			<Stack>
				<Text as={"h1"}>{label}</Text>
				<Divider />
				<Text>
					{total}
					{label === "講座開催数" || label === "MX講座開催数" ? "回" : "人"}
				</Text>
			</Stack>
		</Box>
	);
};
