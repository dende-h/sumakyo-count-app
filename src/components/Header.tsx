import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { memo } from "react";
import { DrawerMenu } from "./DrawerMenu";

export const Header = memo(() => {
	return (
		<>
			<Flex bg="teal.100" w="100%" h={["50px", "60px", "70px"]} justifyContent={"center"} fontFamily={"cursive"}>
				<Text fontSize={"x-large"} fontWeight="bold" lineHeight={["50px", "60px", "70px"]} marginLeft={4}>
					スマ教実績管理アプリ
				</Text>

				<Spacer />
				<Box p={[0, 2, 3]}>
					<DrawerMenu />
				</Box>
			</Flex>
		</>
	);
});
