import { EditIcon } from "@chakra-ui/icons";
import {
	Button,
	IconButton,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure
} from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { memo, VFC } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { achievementsArray } from "../globalState/achievementsArray";
import { isLoadingState } from "../globalState/isLoadingState";
import { userCount } from "../pages";
import { EditItemsCard } from "./EditItemsCard";

type Props = {
	editItem: userCount;
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const EditRowModal: VFC<Props> = memo((props: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	//編集対象のオブジェクトを受け取る
	const { editItem } = props;
	//ローディングの状態を表すグローバルステイト
	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	//編集するachievementsのグローバルステイト配列
	const [achievements, setAchievements] = useRecoilState(achievementsArray);

	const onClickDeleteButton = async () => {
		setIsLoading(true);
		// const { data, error } = await supabase.from("achievements").delete().eq();
		// if (error) {
		// 	toast.error(error.message);
		// }
		// if (data) {
		// 	toast.success("内容を更新しました");
		// const newAchievements = achievements.filter((item) => {
		// 	return item.id !== id;
		// });
		// setAchievements(newAchievements);
		onClose();
	};
	setIsLoading(false);

	return (
		<>
			<IconButton
				aria-label="editRow"
				icon={<EditIcon />}
				borderRadius={"full"}
				colorScheme={"twitter"}
				size={"sm"}
				onClick={onOpen}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>内容を更新</ModalHeader>
					<ModalBody pb={6}>
						<EditItemsCard editItem={editItem} />
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={onClickDeleteButton}
							isDisabled={isLoading}
							isLoading={isLoading}
						>
							update
						</Button>
						<Button onClick={onClose} isDisabled={isLoading} isLoading={isLoading}>
							cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});
