import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	IconButton,
	useDisclosure,
	Stack,
	Button,
	Box,
	Divider
} from "@chakra-ui/react";
import Link from "next/link";

export const DrawerMenu = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<IconButton
				aria-label="menu"
				bgColor={"telegram.500"}
				color={"gray.50"}
				_hover={{ opacity: 0.6 }}
				icon={<HamburgerIcon />}
				onClick={onOpen}
			/>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader textAlign={"center"}>Menu</DrawerHeader>

					<DrawerBody textAlign={"center"}>
						<Stack>
							<Divider />
							<Box p={2} onClick={onClose}>
								<Link href={"/"}>
									<a>実績入力</a>
								</Link>
							</Box>
							<Divider />
							<Box p={2} onClick={onClose}>
								<Link href={"/dashboard"}>
									<a>トータル実績</a>
								</Link>
							</Box>
							<Divider />
							<Box p={2} onClick={onClose}>
								<Link href={"/viewtable"}>
									<a>一覧テーブル</a>
								</Link>
							</Box>
							<Divider />
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};
