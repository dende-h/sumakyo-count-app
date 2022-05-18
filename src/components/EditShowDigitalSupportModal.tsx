import { EditIcon } from "@chakra-ui/icons";
import { IconButton, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { memo, useRef, VFC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dateState } from "../globalState/dateState";
import { digitalSupport } from "../globalState/digitalSupportState";
import { isLoadingState } from "../globalState/isLoadingState";
import { EditShowDigitalSupportCard } from "./EditShowDigitalSupportCard";

type Props = {
	editItem: digitalSupport;
};

export const EditShowDigitalSupportModal: VFC<Props> = memo((props: Props) => {
	const isLoading = useRecoilValue(isLoadingState);
	const { isOpen, onOpen, onClose } = useDisclosure();
	//編集対象のオブジェクトを受け取る
	const { editItem } = props;

	const cancel = () => {
		onClose();
	};
	const setEditDate = useSetRecoilState(dateState);
	const clickButton = () => {
		setEditDate(editItem.event_date);
		onOpen();
	};

	//開いたときにフォーカスを当てるフォームを指定するための変数
	const initialRef = useRef();

	return (
		<>
			<IconButton
				aria-label="editRow"
				icon={<EditIcon />}
				borderRadius={"full"}
				colorScheme={"twitter"}
				size={"sm"}
				onClick={clickButton}
				isDisabled={isLoading}
				isLoading={isLoading}
			/>

			<Modal isOpen={isOpen} onClose={onClose} size={"sm"} initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent textAlign={"center"}>
					<EditShowDigitalSupportCard editItem={editItem} onClickCancel={cancel} initialFocusRef={initialRef} />
				</ModalContent>
			</Modal>
		</>
	);
});
