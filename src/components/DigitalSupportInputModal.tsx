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
import { useRecoilState, useRecoilValue } from "recoil";
import { dateState } from "../globalState/dateState";
import { digitalSupportEventArray } from "../globalState/digitalSupportEventArray";
import { digitalSupport, digitalSupportState } from "../globalState/digitalSupportState";
import { isLoadingState } from "../globalState/isLoadingState";
import { shopNameArray } from "../globalState/shopNameArray";
import { useCountUpDown } from "../hooks/useCountUpDown";
import { useSelectOnChange } from "../hooks/useSelectOnChange";
import { CustomDatePickerCalendar } from "./CustomDatePickerCalendar";
import { InputItemsCard } from "./InputItemsCard";

type Props = {
	digital_support: digitalSupport[];
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const DigitalSupportInputModal: VFC<Props> = memo((props: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	//編集対象のオブジェクトを受け取る
	const { digital_support } = props;

	const cancel = () => {
		onClose();
	};

	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	console.log(digital_support);

	const [digitalSupportAchievements, setDigitalSuportAchievements] = useRecoilState(digitalSupportState);
	const [digitalSupportAchievement, setDigitalSupportAchievement] = useState<digitalSupport>({
		event_name: "",
		participants: 0,
		event_date: "",
		shop_name: "",
		half_count: false
	});

	const initialShopNameList = useRecoilValue(shopNameArray);
	const shopNameList = initialShopNameList.filter((item) => {
		return item !== "全店舗";
	});
	console.log(shopNameList);
	const eventNameList = useRecoilValue(digitalSupportEventArray);

	useEffect(() => {
		setDigitalSuportAchievements(digital_support);
	}, []);
	console.log(digitalSupportAchievements);

	const eventName = useSelectOnChange();
	const [halfCount, setHalfCount] = useState(false);
	const participants = useCountUpDown();
	const shopName = useSelectOnChange();
	const inputDate = useRecoilValue(dateState);

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

		//カウントデータの初期化
		participants.setCount(0);
		setHalfCount(false);
		eventName.setValue("");
		shopName.setValue("");

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
		console.log(digitalSupportAchievement);
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
									isDisabled={isLoading || shopName.value === "" || eventName.value === ""}
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
