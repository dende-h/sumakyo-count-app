import {
	Box,
	Divider,
	Stack,
	Text,
	Wrap,
	WrapItem,
	Center,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Tab,
	useColorModeValue
} from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { DigitalSupportInputModal } from "../components/DigitalSupportInputModal";
import { digitalSupportEventArray } from "../globalState/digitalSupportEventArray";
import { digitalSupport, digitalSupportState } from "../globalState/digitalSupportState";
import { shopNameArray } from "../globalState/shopNameArray";
import { ShowDigitalSupportCard } from "../components/ShowDigitalSupportCard";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DigitalSupport = ({ digital_support }) => {
	const setDigitalSupportAchievements = useSetRecoilState(digitalSupportState);
	useEffect(() => {
		setDigitalSupportAchievements([...digital_support]);
	}, []);
	//塩山店を０、東山梨店を１、一宮イッツモア店２でタブindexと併せて定義
	const enzanShop: number = 0;
	const higashiYamanshiShop: number = 1;
	const ichinomiyaShop: number = 2;
	//教室のミニマム目標値の定義
	const digitalSupportGoalSetting: number = 35;
	//タブのカラー設定
	const tabColors = useColorModeValue(["teal.50", "blue.100", "orange.100"], ["teal.900", "twitter.900", "orange.900"]);
	//選択しているタブのindexナンバー
	const [tabIndex, setTabIndex] = useState(enzanShop);
	//indexによって背景色変更
	const tabBgColor = tabColors[tabIndex];

	const tabNameArray = useRecoilValue(shopNameArray).filter((item) => item !== "全店舗");

	//選択しているタブによってdigital_supportをfilterする
	const initialdata = useRecoilValue(digitalSupportState);
	const initialDigitalSupport: digitalSupport[] = initialdata.filter((item) => {
		return item.shop_name === tabNameArray[enzanShop];
	});

	const [digitalSupportArray, setDigitalSupportArray] = useState(initialDigitalSupport);

	useEffect(() => {
		const newShowDigitalSupportArray = initialdata.filter((item) => {
			return item.shop_name === tabNameArray[tabIndex];
		});
		setDigitalSupportArray(newShowDigitalSupportArray);
	}, [tabIndex]);
	//指定5講座が実績にあるかどうか
	const eventNameArray = useRecoilValue(digitalSupportEventArray);
	const eventImplementation = eventNameArray.map((item) => {
		return digitalSupportArray.map((item) => item.event_name).includes(item);
	});

	return (
		<>
			<Box m={4}>
				<Stack>
					<Text fontSize={"x-large"} fontWeight="bold">
						デジタル活用支援実績
					</Text>
					<Divider borderColor={"gray.500"} />
					<DigitalSupportInputModal digital_support={digital_support} />
					<Center>
						<Wrap fontSize={["large", "x-large"]} fontWeight={"bold"} m={2} spacing={[5, 8, 10]}>
							<WrapItem>
								<Text>デジ活教室実施回数：{digitalSupportArray.length}回</Text>
							</WrapItem>
							<WrapItem>
								<Text>Min目標まで残り{digitalSupportGoalSetting - digitalSupportArray.length}回</Text>
							</WrapItem>
							<WrapItem>
								<Text>指定講座実施状況：現在{eventImplementation.filter((item) => item === true).length}講座達成</Text>
							</WrapItem>
						</Wrap>
					</Center>
					<Divider borderColor={"gray.500"} />
					<Tabs
						onChange={(index) => {
							if (index === enzanShop) {
								setTabIndex(enzanShop);
							}
							if (index === higashiYamanshiShop) {
								setTabIndex(higashiYamanshiShop);
							}
							if (index === ichinomiyaShop) {
								setTabIndex(ichinomiyaShop);
							}
						}}
						variant="enclosed"
					>
						<TabList>
							{tabNameArray.map((item, index) => {
								return (
									<Tab bg={tabIndex === index ? tabBgColor : "gray.100"} fontSize={["sm", "md", "large"]}>
										{item}
									</Tab>
								);
							})}
						</TabList>
						<TabPanels bg={tabBgColor}>
							<TabPanel>
								<ShowDigitalSupportCard showDigitalSupportArray={digitalSupportArray} />
							</TabPanel>
							<TabPanel>
								<ShowDigitalSupportCard showDigitalSupportArray={digitalSupportArray} />
							</TabPanel>
							<TabPanel>
								<ShowDigitalSupportCard showDigitalSupportArray={digitalSupportArray} />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Stack>
			</Box>
		</>
	);
};

export const getServerSideProps = async () => {
	const { data: digital_support, error } = await supabase
		.from("digital_support")
		.select("*")
		.order("event_date", { ascending: true });
	if (error) {
	}
	return { props: { digital_support } };
};

export default DigitalSupport;
