import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import Link from "next/link";
import { memo } from "react";
import { DrawerMenu } from "./DrawerMenu";

export const Header = memo(() => {
	return (
		<>
			<Flex bg="teal.100" w="100%" h={["50px", "60px", "70px"]} justifyContent={"center"} fontFamily={"cursive"}>
				<Box as={"h1"} p={2}>
					<Text fontSize={"lg"} fontWeight="bold">
						スマホ教室実績管理アプリ
					</Text>
				</Box>
				<Spacer />
				<Box p={[0, 2, 3]}>
					<DrawerMenu />
				</Box>
			</Flex>
		</>
	);
});
