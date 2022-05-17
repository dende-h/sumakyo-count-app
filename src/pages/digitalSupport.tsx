import {
	Box,
	Button,
	Divider,
	Select,
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
	useColorMode,
	useColorModeValue
} from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { CustomDatePickerCalendar } from "../components/CustomDatePickerCalendar";
import { DigitalSupportInputModal } from "../components/DigitalSupportInputModal";
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
	//タブのカラー設定
	const tabColors = useColorModeValue(["teal.50", "blue.100", "orange.100"], ["teal.900", "twitter.900", "orange.900"]);
	//選択しているタブのindexナンバー
	const [tabIndex, setTabIndex] = useState(0);
	//indexによって背景色変更
	const tabBgColor = tabColors[tabIndex];

	const tabNameArray = useRecoilValue(shopNameArray).filter((item) => item !== "全店舗");

	//選択しているタブによってdigital_supportをfilterする
	// const showDigitalSupportArray =

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
								<Text>現在のトータル実施回数</Text>
							</WrapItem>
							<WrapItem>
								<Text>Min目標まであと何回</Text>
							</WrapItem>
							<WrapItem>
								<Text>主要項目実施状況</Text>
							</WrapItem>
						</Wrap>
					</Center>
					<Divider borderColor={"gray.500"} />
					<Tabs
						onChange={(index) => {
							setTabIndex(index);
						}}
						variant="enclosed"
					>
						<TabList>
							{tabNameArray.map((item, index) => {
								return <Tab bg={tabIndex === index ? tabBgColor : "gray.100"}>{item}</Tab>;
							})}
						</TabList>
						<TabPanels bg={tabBgColor}>
							<TabPanel>1</TabPanel>
							<TabPanel>2</TabPanel>
							<TabPanel>3</TabPanel>
						</TabPanels>
					</Tabs>
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
