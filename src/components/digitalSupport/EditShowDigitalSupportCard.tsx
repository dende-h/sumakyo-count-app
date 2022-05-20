import { Box, Button, Divider, Select, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { memo, MutableRefObject, useEffect, useState, VFC } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { dateState } from "../../globalState/dateState";
import { digitalSupportEventArray } from "../../globalState/digitalSupportEventArray";
import { digitalSupport, digitalSupportState } from "../../globalState/digitalSupportState";
import { isLoadingState } from "../../globalState/isLoadingState";
import { shopNameArray } from "../../globalState/shopNameArray";
import { useCountUpDown } from "../../hooks/useCountUpDown";
import { useSelectOnChange } from "../../hooks/useSelectOnChange";
import { CustomDatePickerCalendar } from "../index/CustomDatePickerCalendar";
import { InputItemsCard } from "../index/InputItemsCard";

type Props = {
	editItem: digitalSupport;
	onClickCancel: () => void;
	initialFocusRef: MutableRefObject<undefined>;
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const EditShowDigitalSupportCard: VFC<Props> = memo((props: Props) => {
	//編集対象のオブジェクトを受け取る
	const { editItem, onClickCancel, initialFocusRef } = props;

	const cancel = () => {
		onClickCancel();
	};

	const eventNameList = useRecoilValue(digitalSupportEventArray);

	const eventName = useSelectOnChange(editItem.event_name);
	const [halfCount, setHalfCount] = useState(false);
	const participants = useCountUpDown(editItem.participants);
	const shopName = useSelectOnChange(editItem.shop_name);
	const inputDate = useRecoilValue(dateState);

	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	const setDigitalSuportAchievements = useSetRecoilState(digitalSupportState);
	const [digitalSupportAchievement, setDigitalSupportAchievement] = useState<digitalSupport>({
		event_name: editItem.event_name,
		participants: editItem.participants,
		event_date: editItem.event_date,
		shop_name: editItem.shop_name,
		half_count: editItem.half_count
	});

	const initialShopNameList = useRecoilValue(shopNameArray);
	const shopNameList = initialShopNameList.filter((item) => {
		return item !== "全店舗";
	});

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

		const { error } = await supabase.from("digital_support").update(digitalSupportAchievement).eq("id", editItem.id);

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

	return (
		<>
			<Box m={4}>
				<Stack>
					<Text fontSize={"x-large"} fontWeight="bold">
						デジタル活用支援実績編集
					</Text>
					<Divider borderColor={"gray.500"} />
					<Text fontSize={"lg"} fontWeight={"bold"}>
						実績日と店舗を選択
					</Text>
					<Stack p={2}>
						<CustomDatePickerCalendar inputDate={editItem.event_date} />
						<Select
							onChange={shopName.onChangeSelect}
							placeholder="店舗を選択"
							backgroundColor={"white"}
							ref={initialFocusRef}
							defaultValue={editItem.shop_name}
						>
							{shopNameList.map((item) => {
								return (
									<option key={item} value={item}>
										{item}
									</option>
								);
							})}
						</Select>
						<Select
							onChange={eventName.onChangeSelect}
							placeholder="実施講座名を選択"
							backgroundColor={"white"}
							defaultValue={editItem.event_name}
						>
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
							更新
						</Button>
					</Box>
				</Stack>
			</Box>
		</>
	);
});
