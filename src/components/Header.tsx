import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { memo } from "react";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { DrawerMenu } from "./DrawerMenu";

export const Header = memo(() => {
	return (
		<>
			<Flex bg="teal.100" w="100%" h={["50px", "60px", "70px"]} justifyContent={"center"} fontFamily={"cursive"}>
				<Text fontSize={["md", "lg", "x-large"]} fontWeight="bold" lineHeight={["50px", "60px", "70px"]} marginLeft={4}>
					スマ教実績管理アプリ
				</Text>

				<Spacer />
				<Box marginRight={16} lineHeight={["50px", "60px", "70px"]}>
					<DrawerMenu />
				</Box>
				<DarkModeSwitch />
			</Flex>
		</>
	);
});
