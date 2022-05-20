import {
	Box,
	Button,
	Divider,
	Modal,
	ModalContent,
	ModalOverlay,
	Select,
	Stack,
	Text,
	useDisclosure,
	Wrap,
	WrapItem
} from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import React, { memo, useEffect, useState, VFC } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dateState } from "../../globalState/index/dateState";
import { digitalSupportEventArray } from "../../globalState/digitalSupport/digitalSupportEventArray";
import { digitalSupport, digitalSupportState } from "../../globalState/digitalSupport/digitalSupportState";
import { isLoadingState } from "../../globalState/index/isLoadingState";
import { shopNameArray } from "../../globalState/index/shopNameArray";
import { useCountUpDown } from "../../hooks/useCountUpDown";
import { useSelectOnChange } from "../../hooks/useSelectOnChange";
import { CustomDatePickerCalendar } from "../index/CustomDatePickerCalendar";
import { InputItemsCard } from "../index/InputItemsCard";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const DigitalSupportInputModal: VFC = memo(() => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

	const setDigitalSuportAchievements = useSetRecoilState(digitalSupportState);

	const initialShopNameList = useRecoilValue(shopNameArray);
	const shopNameList = initialShopNameList.filter((item) => {
		return item !== "全店舗";
	});

	const eventNameList = useRecoilValue(digitalSupportEventArray);

	const eventName = useSelectOnChange("");
	const [halfCount, setHalfCount] = useState(false);
	const participants = useCountUpDown(0);
	const shopName = useSelectOnChange("");
	const inputDate = useRecoilValue(dateState);

	const [digitalSupportAchievement, setDigitalSupportAchievement] = useState<digitalSupport>({
		event_name: "",
		participants: 0,
		event_date: "",
		shop_name: "",
		half_count: false
	});

	useEffect(() => {
		if (isOpen) {
			eventName.setValue("");
			setHalfCount(false);
			participants.setCount(0);
			shopName.setValue("");
		} else {
			setDigitalSupportAchievement({
				event_name: "",
				participants: 0,
				event_date: "",
				shop_name: "",
				half_count: false
			});
			eventName.setValue("");
			setHalfCount(false);
			participants.setCount(0);
			shopName.setValue("");
		}
	}, [isOpen]);

	const cancel = () => {
		onClose();
	};

	useEffect(() => {
		setDigitalSupportAchievement({
			event_name: eventName.value,
			participants: participants.count,
			event_date: inputDate,
			shop_name: shopName.value,
			half_count: halfCount
		});
	}, [eventName.value, participants.count, inputDate, shopName.value, halfCount]);

	const onSubmit = async () => {
		setIsLoading(true);

		const { error } = await supabase.from("digital_support").insert(digitalSupportAchievement);

		if (error) {
			//エラー時のコンソール表示
			toast.error(error.message);
			setIsLoading(false);
		} else {
			const { data, error } = await supabase.from("digital_support").select("*");
			if (error) {
			} else {
				const newDigitalSupport = data;
				setDigitalSuportAchievements(newDigitalSupport);
			}
			toast.success("登録完了しました");
			setIsLoading(false);
			cancel();
		}
	};
	//開いたときにフォーカスを当てるフォームを指定するための変数
	const initialRef = React.useRef();

	return (
		<>
			<Button onClick={onOpen} colorScheme="teal" isDisabled={isLoading} isLoading={isLoading}>
				実績を入力する
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size={"sm"} initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent>
					<Box m={4}>
						<Stack>
							<Text fontSize={"x-large"} fontWeight="bold">
								デジタル活用支援実績入力
							</Text>
							<Divider borderColor={"gray.500"} />
							<Text fontSize={"lg"} fontWeight={"bold"}>
								実績日と店舗を選択
							</Text>
							<Stack p={2}>
								<CustomDatePickerCalendar />

								<Select
									onChange={shopName.onChangeSelect}
									placeholder="店舗を選択"
									backgroundColor={"white"}
									ref={initialRef}
								>
									{shopNameList.map((item) => {
										return (
											<option key={item} value={item}>
												{item}
											</option>
										);
									})}
								</Select>
								<Select onChange={eventName.onChangeSelect} placeholder="実施講座名を選択" backgroundColor={"white"}>
									{eventNameList.map((item) => {
										return (
											<option key={item} value={item}>
												{item}
											</option>
										);
									})}
								</Select>
							</Stack>

							<Text fontSize={"lg"} fontWeight={"bold"}>
								教室参加人数の入力
							</Text>
							<Wrap>
								<WrapItem>
									<InputItemsCard itemLabel={"教室参加者数"} inputItem={participants} loading={isLoading} />
								</WrapItem>
								<WrapItem>
									<Button
										onClick={() => setHalfCount(!halfCount)}
										colorScheme={halfCount ? "orange" : "teal"}
										isDisabled={isLoading}
										isLoading={isLoading}
									>
										{halfCount ? "0.5カウント" : "1.0カウント"}
									</Button>
									※0.5回講座の場合はクリック
								</WrapItem>
							</Wrap>
							<Box>
								<Button
									onClick={onSubmit}
									colorScheme="teal"
									isDisabled={isLoading || shopName.value === "" || eventName.value === "" || participants.count <= 0}
									isLoading={isLoading}
								>
									送信
								</Button>
							</Box>
						</Stack>
					</Box>
				</ModalContent>
			</Modal>
		</>
	);
});
