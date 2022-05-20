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
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DigitalSupportInputModal } from "../components/DigitalSupportInputModal";
import { digitalSupportEventArray } from "../globalState/digitalSupportEventArray";
import { digitalSupportState } from "../globalState/digitalSupportState";
import { shopNameArray } from "../globalState/shopNameArray";
import { ShowDigitalSupportCard } from "../components/ShowDigitalSupportCard";
import { showDigitalSupportAchievements } from "../globalState/selector/showDigitalSupportAchievements";
import { tabIndexState } from "../globalState/tabIndexState";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const DigitalSupport = ({ digital_support }) => {
	const router = useRouter();
	const { user } = useUser();
	if (!user) {
		typeof window === "undefined" ? undefined : router.replace("/api/auth/login");
	}
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
	const tabColors = useColorModeValue(
		["teal.100", "blue.100", "orange.100"],
		["teal.900", "twitter.900", "orange.900"]
	);
	//選択しているタブのindexナンバー
	const [tabIndex, setTabIndex] = useRecoilState(tabIndexState);
	//indexによって背景色変更
	const tabBgColor = tabColors[tabIndex];

	const tabNameArray = useRecoilValue(shopNameArray).filter((item) => item !== "全店舗");

	//選択しているタブによってdigital_supportをfilterする
	const filterData = useRecoilValue(showDigitalSupportAchievements);

	//ワクチンパスポート以外の指定4講座が実績にあるかどうか
	const eventNameArray = useRecoilValue(digitalSupportEventArray);
	const designatedCourses = eventNameArray.filter((item) => {
		return (
			item !== "ワクチンパスポート発行講座" && item !== "ワクチン接種WEB申し込み" && item !== "デジタル活用操作相談会"
		);
	});
	const eventImplementation = designatedCourses.map((item) => {
		return filterData.map((item) => item.event_name).includes(item);
	});

	//それぞれの講座の回数
	// 	"マイナンバーカード申請講座",
	// "マイナポータル講座",
	// 	"マイナポイント予約・申込講座",
	// 	"オンライン診療講座",
	// 	"ワクチンパスポート発行講座",
	// 	"ワクチン接種WEB申し込み",
	// 	"デジタル活用操作相談会";
	const consultationSeminar = filterData.filter((item) => {
		return item.event_name === "デジタル活用操作相談会";
	});
	//相談会の手数料
	const consultationFee =
		consultationSeminar.filter((item) => {
			return item.participants <= 1;
		}).length *
			3200 +
		consultationSeminar.filter((item) => {
			return item.participants > 1;
		}).length *
			6400;

	//0.5回カウント
	const halfCountData = filterData.filter((item) => {
		return item.half_count;
	});
	//1回カウントデータ
	const oneCountData = filterData
		.filter((item) => {
			return item.event_name !== "デジタル活用操作相談会";
		})
		.filter((item) => {
			return !item.half_count;
		});

	console.log(oneCountData);

	//1回カウントの手数料
	const oneCountSeminarFee =
		oneCountData.filter((item) => {
			return item.participants <= 1;
		}).length *
			3200 +
		oneCountData.filter((item) => {
			return item.participants > 1;
		}).length *
			6400;

	//デジタル活用支援の実施回数
	//相談会はカウント対象外、ワクチンパスポートとワクチン申し込みは0.5カウント同月内小数点以下切り下げ
	//開催期間の配列
	const holdingPeriod = [
		"2022/05",
		"2022/06",
		"2022/07",
		"2022/08",
		"2022/09",
		"2022/10",
		"2022/11",
		"2022/12",
		"2023/01",
		"2023/02"
	];
	//上記配列を含む日付でグループ分けした要素数を2で割り小数点を切り下げる
	const vaccinePassSeminarCount = holdingPeriod.map((item) => {
		//指定した月を含む配列の要素数
		const vaccineSeminarCountByMonth = halfCountData.filter((obj) => {
			return obj.event_name === "ワクチンパスポート発行講座" && obj.event_date.includes(item);
		}).length;
		return Math.floor(vaccineSeminarCountByMonth / 2);
	});
	//vaccinePass講座のトータル実績数
	const totalVaccinePassSeminarCount = vaccinePassSeminarCount.reduce((sum, element) => {
		return sum + element;
	}, 0);
	//ワクチンパス講座を含めた指定5講座の実施回数（ワクチンパス講座のカウントが1あれば実施回数に1追加）
	const eventImplementationCount =
		eventImplementation.filter((item) => item === true).length + (totalVaccinePassSeminarCount >= 1 && 1);

	//上記配列を含む日付でグループ分けした要素数を2で割り小数点を切り下げる
	const vaccineApplySeminarCount = holdingPeriod.map((item) => {
		//指定した月を含む配列の要素数
		const vaccineSeminarCountByMonth = halfCountData.filter((obj) => {
			return obj.event_name === "ワクチン接種WEB申し込み" && obj.event_date.includes(item);
		}).length;
		return Math.floor(vaccineSeminarCountByMonth / 2);
	});
	//vaccineApply講座のトータル実績数
	const totalVaccineApplySeminarCount = vaccineApplySeminarCount.reduce((sum, element) => {
		return sum + element;
	}, 0);

	//0.5回講座のトータル実施数
	const totalVaccineSeminarCount = totalVaccinePassSeminarCount + totalVaccineApplySeminarCount;

	//0.5カウント講座の手数料
	const vaccineSeminarFee = totalVaccineSeminarCount * 6400;

	//手数料合計
	const totalFee = oneCountSeminarFee + vaccineSeminarFee + consultationFee;

	//トータル実施回数
	const totalDigitalSupportAchievementCount = oneCountData.length + totalVaccineSeminarCount;

	return (
		<>
			<Box m={4}>
				<Stack>
					<Text fontSize={"x-large"} fontWeight="bold">
						デジタル活用支援実績（Min目標{digitalSupportGoalSetting}回）
					</Text>
					<Divider borderColor={"gray.500"} />
					<DigitalSupportInputModal />
					<Center>
						<Wrap fontSize={["large", "x-large"]} fontWeight={"bold"} m={2} spacing={[5, 8, 10]}>
							<WrapItem>
								<Text color={totalDigitalSupportAchievementCount >= digitalSupportGoalSetting && "orange.500"}>
									デジ活教室実施回数：{totalDigitalSupportAchievementCount}回
								</Text>
							</WrapItem>
							<WrapItem>
								<Text color={digitalSupportGoalSetting - totalDigitalSupportAchievementCount <= 0 && "orange.500"}>
									Min目標まで残り{digitalSupportGoalSetting - totalDigitalSupportAchievementCount}回
								</Text>
							</WrapItem>
							<WrapItem>
								<Text color={eventImplementationCount >= 5 && "orange.500"}>
									指定講座実施状況：現在{eventImplementationCount}講座達成
								</Text>
							</WrapItem>
							<WrapItem>
								<Text>現在手数料見込み：{totalFee}円</Text>
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
									<Tab
										key={index}
										bg={tabIndex === index ? tabBgColor : "gray.100"}
										fontSize={["sm", "md", "large"]}
										fontWeight="bold"
									>
										{item}
									</Tab>
								);
							})}
						</TabList>
						<TabPanels bg={tabBgColor}>
							<TabPanel>
								<ShowDigitalSupportCard showDigitalSupportArray={filterData} />
							</TabPanel>
							<TabPanel>
								<ShowDigitalSupportCard showDigitalSupportArray={filterData} />
							</TabPanel>
							<TabPanel>
								<ShowDigitalSupportCard showDigitalSupportArray={filterData} />
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
