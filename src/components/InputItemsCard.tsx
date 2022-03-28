import { Box, Button, Center, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

type Props = {
	itemLabel: string;
	inputItem: {
		count: number;
		upButtonClick: () => void;
		downButtonClick: () => void;
		setCount: Dispatch<SetStateAction<number>>;
	};
	loading: boolean;
};
export const InputItemsCard = (props: Props) => {
	const { itemLabel, inputItem, loading } = props;

	return (
		<>
			<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
				<Text fontSize={"lg"} fontWeight="bold">
					{itemLabel}
				</Text>
				<Text fontSize={"x-large"} fontWeight={"bold"}>
					{inputItem.count}
				</Text>
				<Center>
					<HStack spacing={4} textAlign="center">
						<Button
							onClick={inputItem.upButtonClick}
							borderRadius="full"
							colorScheme={"twitter"}
							fontSize="lg"
							isDisabled={loading}
						>
							＋
						</Button>
						<Button
							onClick={inputItem.downButtonClick}
							borderRadius="full"
							colorScheme={"twitter"}
							fontSize="lg"
							isDisabled={loading}
						>
							－
						</Button>
					</HStack>
				</Center>
			</Stack>
		</>
	);
};
