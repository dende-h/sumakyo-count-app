import { Box, Button, Divider, Select, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";
import { InputItemsCard } from "../components/InputItemsCard";
import { dateState } from "../globalState/dateState";
import { digitalSupportEventArray } from "../globalState/digitalSupportEventArray";
import { digitalSupport, digitalSupportState } from "../globalState/digitalSupportState";
import { isLoadingState } from "../globalState/isLoadingState";
import { shopNameArray } from "../globalState/shopNameArray";
import { useCountUpDown } from "../hooks/useCountUpDown";
import { useSelectOnChange } from "../hooks/useSelectOnChange";
import { useYearMonthDataSet } from "../hooks/useYearMonthDataSet";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DigitalSupport = ({ digital_support }) => {
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

	const onSubmit = () => {};

	return (
		<>
			<Box m={4}>
				<Stack>
					<Text fontSize={"x-large"} fontWeight="bold">
						デジタル活用支援実績入力ページ
					</Text>
					<Divider borderColor={"gray.500"} />

					<Text fontSize={"lg"} fontWeight={"bold"}>
						実績日と店舗を選択
					</Text>
					<Stack p={2}>
						<CustomDatePickerCalendar />

						<Select onChange={shopName.onChangeSelect} placeholder="店舗を選択" backgroundColor={"white"}>
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
		</>
	);
};

export const getServerSideProps = async () => {
	const { data: digital_support, error } = await supabase.from("digital_support").select("*");
	if (error) {
	}
	return { props: { digital_support } };
};

export default DigitalSupport;
