import { Button, Center, HStack, Stack, Text, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { achievementsArray } from "../../globalState/progress/achievementsArray";
import { isLoadingState } from "../../globalState/index/isLoadingState";
import { useCountUpDown } from "../../hooks/useCountUpDown";
import { userCount } from "../../pages";

type Props = {
	editItem: userCount;
	clickCancel: () => void;
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const EditItemsCard = memo((props: Props) => {
	const { editItem, clickCancel } = props;

	//ローディングの状態を表すグローバルステイト
	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	//編集するachievementsのグローバルステイト配列
	const setAchievements = useSetRecoilState(achievementsArray);

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

	useEffect(() => {
		setAchievement({
			...achievement,
			u_usercount: uniqueUserCount.count,
			new_usercount: newUserCount.count,
			seminar_count: seminarCount.count,
			mx_seminar_count: mxSeminarCount.count,
			mx_usercount: mxUserCount.count
		});
	}, [uniqueUserCount.count, newUserCount.count, seminarCount.count, mxSeminarCount.count, mxUserCount.count]);

	const onClickUpdateButton = async () => {
		setIsLoading(true);

		const { error } = await supabase.from("achievements").update(achievement).eq("id", editItem.id);

		if (error) {
			//エラー時のコンソール表示
			toast.error(error.message);
			setIsLoading(false);
		} else {
			const { data, error } = await supabase
				.from("achievements")
				.select("*")
				.order("date_of_results", { ascending: true });
			if (error) {
			} else {
				const newAchievements = data;
				setAchievements(newAchievements);
			}
			toast.success("登録完了しました");
			setIsLoading(false);
		}
		clickCancel();
	};

	return (
		<>
			<ModalHeader>実績内容を更新</ModalHeader>
			<ModalBody pb={6}>
				<Stack marginLeft={["15px", "50px"]}>
					{editItemsArray.map((item, index) => {
						const label = itemLabel[index];

						return (
							<Stack p={2} maxW={"240px"} backgroundColor={"twitter.100"} textAlign="center" borderRadius={"md"}>
								<Text fontSize={"lg"} fontWeight="bold">
									{label}
								</Text>
								<Text fontSize={"x-large"} fontWeight={"bold"}>
									{item.count}
								</Text>
								<Center>
									<HStack spacing={4} textAlign="center">
										<Button
											onClick={item.upButtonClick}
											borderRadius="full"
											colorScheme={"twitter"}
											fontSize="lg"
											isDisabled={isLoading}
										>
											＋
										</Button>
										<Button
											onClick={item.downButtonClick}
											borderRadius="full"
											colorScheme={"twitter"}
											fontSize="lg"
											isDisabled={isLoading}
										>
											－
										</Button>
									</HStack>
								</Center>
							</Stack>
						);
					})}
				</Stack>
			</ModalBody>
			<ModalFooter>
				<Button colorScheme="blue" mr={3} onClick={onClickUpdateButton} isDisabled={isLoading} isLoading={isLoading}>
					update
				</Button>
				<Button onClick={clickCancel} isDisabled={isLoading} isLoading={isLoading}>
					cancel
				</Button>
			</ModalFooter>
		</>
	);
});
