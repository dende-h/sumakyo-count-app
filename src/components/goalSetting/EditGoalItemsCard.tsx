import { Button, Center, HStack, Stack, Text, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { memo, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { goalValueState } from "../../globalState/goalSetting/goalValueState";
import { isLoadingState } from "../../globalState/index/isLoadingState";
import { useCountUpDown } from "../../hooks/useCountUpDown";
import { goal } from "../../pages/goal_setting";

type Props = {
	editItem: goal;
	clickCancel: () => void;
};

//supabaseのAPI定義
const supabase: SupabaseClient = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export const EditGoalItemsCard = memo((props: Props) => {
	const { editItem, clickCancel } = props;

	//ローディングの状態を表すグローバルステイト
	const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
	//編集するachievementsのグローバルステイト配列
	const setGoals = useSetRecoilState(goalValueState);

	//それぞれの実績入力データ（カウントアップダウン）（数値型）
	const seminarCount = useCountUpDown();
	const uniqueUserCount = useCountUpDown();
	const newUserCount = useCountUpDown();
	const mxSeminarCount = useCountUpDown();
	const mxUserCount = useCountUpDown();

	//初期データとしてeditItemをセット
	useEffect(() => {
		seminarCount.setCount(editItem.seminar_goal);
		uniqueUserCount.setCount(editItem.u_user_goal);
		newUserCount.setCount(editItem.new_user_goal);
		mxSeminarCount.setCount(editItem.mx_seminar_goal);
		mxUserCount.setCount(editItem.mx_user_goal);
	}, []);

	//配列化
	const editItemsArray = [seminarCount, uniqueUserCount, newUserCount, mxSeminarCount, mxUserCount];
	const itemLabel = [
		"講座開催目標",
		"リピートユーザー数目標",
		"新規ユーザー数目標",
		"MX講座開催数目標",
		"MX講座ユーザー数目標"
	];

	//データを書き込むためのオブジェクト定義
	const [newGoal, setNewGoal] = useState<goal>();

	useEffect(() => {
		setNewGoal({
			...newGoal,
			u_user_goal: uniqueUserCount.count,
			new_user_goal: newUserCount.count,
			seminar_goal: seminarCount.count,
			mx_seminar_goal: mxSeminarCount.count,
			mx_user_goal: mxUserCount.count
		});
	}, [uniqueUserCount.count, newUserCount.count, seminarCount.count, mxSeminarCount.count, mxUserCount.count]);

	const onClickUpdateButton = async () => {
		setIsLoading(true);

		const { error } = await supabase.from("goal_value").update(newGoal).eq("id", editItem.id);

		if (error) {
			//エラー時のコンソール表示
			toast.error(error.details);
			setIsLoading(false);
		} else {
			const { data, error } = await supabase.from("goal_value").select("*");
			if (error) {
			} else {
				const newAchievements = data;
				setGoals(newAchievements);
			}
			toast.success("登録完了しました");
			setIsLoading(false);
		}
		clickCancel();
	};

	return (
		<>
			<ModalHeader>目標値を更新</ModalHeader>
			<ModalBody pb={6}>
				<Stack marginLeft={["15px", "50px"]}>
					{editItemsArray.map((item, index) => {
						const label = itemLabel[index];

						return (
							<Stack
								key={index}
								p={2}
								maxW={"240px"}
								backgroundColor={"twitter.100"}
								textAlign="center"
								borderRadius={"md"}
							>
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
