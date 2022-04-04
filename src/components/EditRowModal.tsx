import { EditIcon } from "@chakra-ui/icons";
import { IconButton, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";

import { memo, VFC } from "react";
import { useRecoilValue } from "recoil";
import { isLoadingState } from "../globalState/isLoadingState";
import { userCount } from "../pages";
import { EditItemsCard } from "./EditItemsCard";

type Props = {
	editItem: userCount;
};

export const EditRowModal: VFC<Props> = memo((props: Props) => {
	const isLoading = useRecoilValue(isLoadingState);
	const { isOpen, onOpen, onClose } = useDisclosure();
	//編集対象のオブジェクトを受け取る
	const { editItem } = props;

	const cancel = () => {
		onClose();
	};

	return (
		<>
			<IconButton
				aria-label="editRow"
				icon={<EditIcon />}
				borderRadius={"full"}
				colorScheme={"twitter"}
				size={"sm"}
				onClick={onOpen}
				isDisabled={isLoading}
				isLoading={isLoading}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent textAlign={"center"}>
					<EditItemsCard editItem={editItem} clickCancel={cancel} />
				</ModalContent>
			</Modal>
		</>
	);
});
