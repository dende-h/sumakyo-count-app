import { Button, Center, HStack, Stack, Text } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { useCountUpDown } from "../hooks/useCountUpDown";
import { userCount } from "../pages";

type Props = {
	editItem: userCount;
};

export const EditItemsCard = memo((props: Props) => {
	const { editItem } = props;

	//それぞれの実績入力データ（カウントアップダウン）（数値型）
	const seminarCount = useCountUpDown();
	const uniqueUserCount = useCountUpDown();
	const newUserCount = useCountUpDown();
	const mxSeminarCount = useCountUpDown();
	const mxUserCount = useCountUpDown();

	//初期データとしてeditItemをセット
	useEffect(() => {
		seminarCount.setCount(editItem.seminar_count);
		uniqueUserCount.setCount(editItem.u_usercount);
		newUserCount.setCount(editItem.new_usercount);
		mxSeminarCount.setCount(editItem.mx_seminar_count);
		mxUserCount.setCount(editItem.mx_usercount);
	}, []);

	//配列化
	const editItemsArray = [seminarCount, uniqueUserCount, newUserCount, mxSeminarCount, mxUserCount];
	const itemLabel = ["講座開催数", "リピートユーザー数", "新規ユーザー数", "MX講座開催数", "MX講座ユーザー数"];

	//データを書き込むためのオブジェクト定義
	const [achievement, setAchievement] = useState<userCount>();

	return (
		<>
			{editItemsArray.map((item, index) => {
				const label = itemLabel[index];

				return (
					<Stack p={4} w={"250px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
						<Text fontSize={"lg"} fontWeight="bold">
							{label}
						</Text>
						<Text fontSize={"x-large"} fontWeight={"bold"}>
							{item.count}
						</Text>
						<Center>
							<HStack spacing={4} textAlign="center">
								<Button onClick={item.upButtonClick} borderRadius="full" colorScheme={"twitter"} fontSize="lg">
									＋
								</Button>
								<Button onClick={item.downButtonClick} borderRadius="full" colorScheme={"twitter"} fontSize="lg">
									－
								</Button>
							</HStack>
						</Center>
					</Stack>
				);
			})}
		</>
	);
});
