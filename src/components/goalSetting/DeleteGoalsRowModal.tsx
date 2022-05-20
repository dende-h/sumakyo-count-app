import { DeleteIcon } from "@chakra-ui/icons";
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
import { goalValueState } from "../../globalState/goalSetting/goalValueState";
import { isLoadingState } from "../../globalState/index/isLoadingState";

type Props = {
	id: number;
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const DeleteGoalsRowModal: VFC<Props> = memo((props: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	//削除対象行のidを受け取る
	const { id } = props;
	//ローディングの状態を表すグローバルステイト
	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	//削除時に編集するachievementsのグローバルステイト配列
	const [goals, setGoals] = useRecoilState(goalValueState);

	const onClickDeleteButton = async () => {
		setIsLoading(true);
		const { data, error } = await supabase.from("goal_value").delete().eq("id", id);
		if (error) {
			toast.error(error.message);
		}
		if (data) {
			toast.success("削除完了しました");
			const newGoals = goals.filter((item) => {
				return item.id !== id;
			});
			setGoals(newGoals);
			onClose();
		}
		setIsLoading(false);
	};

	return (
		<>
			<IconButton
				aria-label="deleteRow"
				icon={<DeleteIcon />}
				borderRadius={"full"}
				colorScheme={"twitter"}
				size={"sm"}
				onClick={onOpen}
				isDisabled={isLoading}
				isLoading={isLoading}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>本当に削除しますか？</ModalHeader>
					<ModalBody pb={6}>削除後は元に戻せません!</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={onClickDeleteButton}
							isDisabled={isLoading}
							isLoading={isLoading}
						>
							delete
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
