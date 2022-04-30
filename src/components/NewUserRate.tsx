import { Divider, Stack, Text } from "@chakra-ui/react";

type Props = {
	label: string;
	newUser: number;
	repeatUser: number;
};

export const NewUserRate = (props: Props) => {
	const { label, newUser, repeatUser } = props;

	return (
		<>
			{newUser === 0 || repeatUser === 0 ? (
				<></>
			) : (
				<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
					<Text fontSize={"lg"} fontWeight="bold">
						{label}
					</Text>
					<Divider borderColor={"blue.500"} />
					<Text fontSize={"x-large"} fontWeight={"bold"}>
						{((newUser / (newUser + repeatUser)) * 100).toFixed(1)}%
					</Text>
				</Stack>
			)}
		</>
	);
};
