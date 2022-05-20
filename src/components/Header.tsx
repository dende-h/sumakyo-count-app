import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { memo } from "react";
import { DrawerMenu } from "./DrawerMenu";

export const Header = memo(() => {
	return (
		<>
			<Flex bg="teal.100" w="100%" h={["50px", "60px", "70px"]} justifyContent={"center"} fontFamily={"cursive"}>
				<Text fontSize={["md", "lg", "x-large"]} fontWeight="bold" lineHeight={["50px", "60px", "70px"]} marginLeft={4}>
					スマ教実績管理アプリ
				</Text>
				<Box lineHeight={["50px", "60px", "70px"]} marginLeft={4}>
					<Text>ver 2.2</Text>
				</Box>

				<Spacer />
				<Box marginRight={4} lineHeight={["50px", "60px", "70px"]}>
					<DrawerMenu />
				</Box>
			</Flex>
		</>
	);
});
