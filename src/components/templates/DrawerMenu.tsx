import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	IconButton,
	useDisclosure,
	Stack,
	Box,
	Divider
} from "@chakra-ui/react";
import Link from "next/link";
import { memo } from "react";

export const DrawerMenu = memo(() => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const onClickClose = () => {
		setTimeout(() => {
			onClose();
		}, 1200);
	};

	return (
		<>
			<IconButton
				aria-label="menu"
				bgColor={"telegram.500"}
				color={"gray.50"}
				_hover={{ opacity: 0.6 }}
				icon={<HamburgerIcon />}
				onClick={onOpen}
				boxSize={[6, 8, 10]}
			/>
			<Drawer isOpen={isOpen} onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader textAlign={"center"}>Menu</DrawerHeader>

					<DrawerBody textAlign={"center"}>
						<Stack>
							<Divider />
							<Box p={2} onClick={onClickClose}>
								<Link href={"/"}>
									<a>実績入力</a>
								</Link>
							</Box>
							<Divider />
							<Box p={2} onClick={onClickClose}>
								<Link href={"/progress"}>
									<a>日報と進捗</a>
								</Link>
							</Box>
							<Divider />
							<Box p={2} onClick={onClickClose}>
								<Link href={"/digitalSupport"}>
									<a>デジタル活用支援</a>
								</Link>
							</Box>
							<Divider />
							<Box p={2} onClick={onClickClose}>
								<Link href={"/goal_setting"}>
									<a>目標設定フォーム</a>
								</Link>
							</Box>
							<Divider />
							<Box p={2}>
								<Link href={"/api/auth/logout"}>
									<a>ログアウト</a>
								</Link>
							</Box>
							<Divider />
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
});
